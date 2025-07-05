# 🔐 KAuth — Local Auth Testing Sandbox

KAuth is a local application designed to **test, simulate, and learn** the mechanisms behind web authentication systems. Built for developers, ethical hackers, and students, it offers a playground for experimenting with login flows, session management, token-based authentication, and brute-force protection.

## ✨ Features

- 🔑 Login system with:
  - Session + Cookie authentication
  - JWT (JSON Web Token) authentication
  - Token-in-URL simulation (to demonstrate bad practices)

- 🚫 Fail2ban simulator:
  - IP tracking
  - Ban after X failed attempts
  - Ban duration customization

- 🧠 Educational modules:
  - Token viewer (JWT payload, cookie values, etc.)
  - Login logs with IP, method, timestamp
  - XSS simulation (for cookie theft)
  - Brute force attack tester

- 🔐 Security best practices:
  - Passwords hashed with bcrypt
  - CSRF token protection
  - Secure, HttpOnly cookie handling
  - LocalStorage vs Cookie visualization

## 📚 Use Cases

- Learn how login and token systems work
- Understand security flaws and how to avoid them
- Test real-world authentication logic locally
- Practice ethical hacking and pentesting techniques

## 🧰 Tech Stack

- **Backend**: Python (Flask), Flask-JWT-Extended, Flask-Login
- **Frontend**: HTML/CSS/JavaScript
- **Database**: SQLite (or mock JSON-based system)
- **Security**: bcrypt, CSRF protection, simulated fail2ban

## 📦 Installation

### 🔗 Prerequisites
- Python 3.8+
- pip

### ⚙️ Setup
```bash
git clone https://github.com/votre-utilisateur/kauth.git
cd kauth
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
