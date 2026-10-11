from fastapi.testclient import TestClient

USER_A = {"email": "user.a@trendlens.internal", "password": "Password#123A", "name": "User A"}
USER_B = {"email": "user.b@trendlens.internal", "password": "Password#123B", "name": "User B"}


def get_token_for(client: TestClient, user_data: dict) -> str:
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": user_data["name"],
            "email": user_data["email"],
            "password": user_data["password"],
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": user_data["email"], "password": user_data["password"]},
    )
    return login_res.json()["access_token"]


def test_watchlist_empty_initially(client: TestClient):
    token = get_token_for(client, USER_A)
    response = client.get(
        "/api/v1/watchlist",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["count"] == 0


def test_watchlist_add_and_get(client: TestClient):
    token = get_token_for(client, USER_A)

    # Add RELIANCE.NS
    res_add = client.post(
        "/api/v1/watchlist",
        json={"symbol": "reliance.ns"},  # should format to uppercase
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res_add.status_code == 201
    item = res_add.json()
    assert item["symbol"] == "RELIANCE.NS"

    # Add TCS.NS
    client.post(
        "/api/v1/watchlist",
        json={"symbol": "TCS.NS"},
        headers={"Authorization": f"Bearer {token}"},
    )

    # Fetch watchlist
    res_get = client.get(
        "/api/v1/watchlist",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res_get.status_code == 200
    data = res_get.json()
    assert data["count"] == 2
    symbols = [x["symbol"] for x in data["items"]]
    assert "RELIANCE.NS" in symbols
    assert "TCS.NS" in symbols


def test_watchlist_remove(client: TestClient):
    token = get_token_for(client, USER_A)
    client.post(
        "/api/v1/watchlist",
        json={"symbol": "INFY.NS"},
        headers={"Authorization": f"Bearer {token}"},
    )

    # Remove symbol
    del_res = client.delete(
        "/api/v1/watchlist/INFY.NS",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert del_res.status_code == 200
    assert "Removed 'INFY.NS'" in del_res.json()["message"]

    # Verify empty now
    res_get = client.get(
        "/api/v1/watchlist",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res_get.json()["count"] == 0


def test_watchlist_remove_not_found(client: TestClient):
    token = get_token_for(client, USER_A)
    del_res = client.delete(
        "/api/v1/watchlist/NONEXISTENT.NS",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert del_res.status_code == 404
    assert "not found" in del_res.json()["detail"].lower()


def test_watchlist_user_isolation(client: TestClient):
    token_a = get_token_for(client, USER_A)
    token_b = get_token_for(client, USER_B)

    # User A adds HDFCBANK.NS
    client.post(
        "/api/v1/watchlist",
        json={"symbol": "HDFCBANK.NS"},
        headers={"Authorization": f"Bearer {token_a}"},
    )

    # User B queries their watchlist -> must be empty
    res_b = client.get(
        "/api/v1/watchlist",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert res_b.status_code == 200
    assert res_b.json()["count"] == 0
    assert res_b.json()["items"] == []

    # User B cannot delete User A's item
    del_b = client.delete(
        "/api/v1/watchlist/HDFCBANK.NS",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert del_b.status_code == 404

    # User A's item remains intact
    res_a = client.get(
        "/api/v1/watchlist",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert res_a.status_code == 200
    assert res_a.json()["count"] == 1
    assert res_a.json()["items"][0]["symbol"] == "HDFCBANK.NS"
