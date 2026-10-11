from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.models.user import User

VALID_EMAIL = "quant.analyst@trendlens.internal"
VALID_PASSWORD = "StrongPassword#2026"


def register_user(
    client: TestClient,
    email: str = VALID_EMAIL,
    password: str = VALID_PASSWORD,
    name: str = "Quant Analyst",
):
    return client.post(
        "/api/v1/auth/register",
        json={"full_name": name, "email": email, "password": password},
    )


def login_user(client: TestClient, email: str = VALID_EMAIL, password: str = VALID_PASSWORD):
    return client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )


def test_register_success(client: TestClient, db_session: Session):
    response = register_user(client)
    assert response.status_code == 201
    assert "Registration request received" in response.json()["message"]

    # Verify user exists in DB and password is not stored in plaintext
    user = db_session.scalar(select(User).where(User.email == VALID_EMAIL))
    assert user is not None
    assert user.full_name == "Quant Analyst"
    assert user.password_hash != VALID_PASSWORD
    assert user.password_hash.startswith("$argon2")
    assert verify_password(VALID_PASSWORD, user.password_hash)


@pytest.mark.parametrize("weak_password", [
    "short1!",        # < 8 chars
    "nouppercase123!", # no uppercase
    "NONUMBERHERE!",   # no number
    "NoSpecialChar1",  # no special char
])
def test_register_weak_password_rejected(client: TestClient, weak_password: str):
    response = client.post(
        "/api/v1/auth/register",
        json={"full_name": "Test User", "email": "test@example.com", "password": weak_password},
    )
    assert response.status_code in (400, 422)


def test_register_duplicate_email_non_enumeration(client: TestClient, db_session: Session):
    # First registration
    res1 = register_user(client, email="duplicate@example.com")
    assert res1.status_code == 201

    # Second registration with same email
    res2 = register_user(client, email="duplicate@example.com", name="Another Person")
    # Must return identical message without leaking existence
    assert res2.status_code == 201
    assert res2.json()["message"] == res1.json()["message"]

    # Verify only 1 user exists in DB
    users = db_session.scalars(select(User).where(User.email == "duplicate@example.com")).all()
    assert len(users) == 1
    assert users[0].full_name == "Quant Analyst"


def test_login_success(client: TestClient):
    register_user(client)
    response = login_user(client)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in_minutes"] > 0


def test_login_failure_wrong_password(client: TestClient):
    register_user(client)
    response = login_user(client, password="WrongPassword#123")
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."


def test_login_failure_non_existent_email(client: TestClient):
    response = login_user(client, email="nonexistent@example.com")
    assert response.status_code == 401
    # Error message must be identical to avoid email enumeration
    assert response.json()["detail"] == "Invalid email or password."


def test_login_rate_limiting(client: TestClient):
    register_user(client)

    # Trigger 5 failed attempts
    for _ in range(5):
        res = login_user(client, password="WrongPassword#123")
        assert res.status_code == 401

    # 6th attempt should be blocked by rate limiter with 429
    blocked_res = login_user(client, password="WrongPassword#123")
    assert blocked_res.status_code == 429
    assert "Too many failed login attempts" in blocked_res.json()["detail"]


def test_get_me_authenticated(client: TestClient):
    register_user(client)
    login_res = login_user(client)
    token = login_res.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == VALID_EMAIL
    assert data["full_name"] == "Quant Analyst"
    assert data["theme"] == "dark"
    assert data["default_stock"] == "RELIANCE.NS"
    assert data["default_horizon"] == 15
    assert data["show_uncertainty"] is True
    assert data["show_90_band"] is True


def test_get_me_unauthenticated(client: TestClient):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_get_me_expired_token(client: TestClient, db_session: Session):
    register_user(client)
    user = db_session.scalar(select(User).where(User.email == VALID_EMAIL))

    # Create expired token (-1 minute)
    expired_token = create_access_token(
        subject=user.id, expires_delta=timedelta(minutes=-1)
    )

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert response.status_code == 401
    assert "Invalid or expired access token" in response.json()["detail"]


def test_update_me_preferences(client: TestClient):
    register_user(client)
    login_res = login_user(client)
    token = login_res.json()["access_token"]

    update_payload = {
        "full_name": "Senior Quant Trader",
        "default_stock": "TCS.NS",
        "default_horizon": 30,
        "show_90_band": False,
        "email_on_resolve": True,
    }

    response = client.patch(
        "/api/v1/auth/me",
        json=update_payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Senior Quant Trader"
    assert data["default_stock"] == "TCS.NS"
    assert data["default_horizon"] == 30
    assert data["show_90_band"] is False
    assert data["email_on_resolve"] is True


def test_change_password_success(client: TestClient):
    register_user(client)
    login_res = login_user(client)
    token = login_res.json()["access_token"]

    new_password = "BrandNewPassword#999"
    response = client.post(
        "/api/v1/auth/change-password",
        json={"current_password": VALID_PASSWORD, "new_password": new_password},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert "Password changed successfully" in response.json()["message"]

    # Verify old password no longer works
    old_login = login_user(client, password=VALID_PASSWORD)
    assert old_login.status_code == 401

    # Verify new password logs in
    new_login = login_user(client, password=new_password)
    assert new_login.status_code == 200


def test_change_password_invalid_current(client: TestClient):
    register_user(client)
    login_res = login_user(client)
    token = login_res.json()["access_token"]

    response = client.post(
        "/api/v1/auth/change-password",
        json={"current_password": "WrongCurrentPassword#1", "new_password": "NewValidPassword#2"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
    assert "Current password verification failed" in response.json()["detail"]


def test_logout(client: TestClient):
    register_user(client)
    login_res = login_user(client)
    token = login_res.json()["access_token"]

    response = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert "Successfully logged out" in response.json()["message"]
