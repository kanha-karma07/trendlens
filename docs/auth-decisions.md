# TrendLens Authentication & Security Architectural Decisions

## Overview
This document specifies the cryptographic and authentication architectural decisions implemented in TrendLens.

## 1. Password Hashing (Argon2id)
- **Algorithm**: Argon2id via `argon2-cffi` (or `passlib[argon2]`).
- **Rationale**: Argon2id is the winner of the Password Hashing Competition (PHC) and is resistant to both GPU-based brute force and side-channel timing attacks.
- **Salt & Memory**: Uses high-entropy per-user salts with cryptographic memory hardness parameters.

## 2. Password Strength Policy
All passwords must satisfy the following validation rules prior to hashing:
- Minimum length: 8 characters
- At least one uppercase letter (`[A-Z]`)
- At least one digit (`[0-9]`)
- At least one special character (`[!@#$%^&*(),.?":{}|<>]`)

## 3. Mitigation of Account / Email Enumeration
- **Registration**: If a user attempts to register with an already existing email address, the API returns a generic non-enumerating 200/201 response (`"If this email is not registered, an account has been created."`) rather than disclosing that the email is already registered.
- **Login**: If authentication fails (wrong password or non-existent email), the API returns a uniform 401 Unauthorized (`"Invalid email or password"`) with identical timing paths where possible.

## 4. Rate Limiting on Authentication Endpoints
- A sliding-window rate limiter monitors consecutive failed login attempts by IP and email identifier.
- Upon 5 failed attempts within 5 minutes, requests are blocked with HTTP 429 Too Many Requests to prevent brute-force attacks.

## 5. Session Management & Token Strategy
- **Access Token**: Short-lived JWT signed using HMAC-SHA256 (`HS256`).
- **Payload**: Subject (`sub` = user UUID), expiration (`exp`), issued-at (`iat`).
- **Logout**: Currently handled by client-side token discard.
- **TODO / Future Roadmap for Refresh Strategy**:
  - Implement HTTP-only secure cookie refresh tokens (`refresh_token`) with rotation.
  - Store token families and jti (JWT ID) in Redis for instant revocation upon logout or suspicious reuse detection.
