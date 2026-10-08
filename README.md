# User and Task API

This project is a REST API built with FastAPI to manage users, JWT authentication, role-based access control, and user-owned tasks. It follows a modular backend structure with Pydantic validation, async SQLAlchemy persistence, and a local SQLite database for development.

## Overview

The application exposes endpoints to:

- Register users
- Authenticate users with email and password
- Generate and validate JWT access tokens
- Retrieve the profile of the authenticated user
- Manage roles such as `user`, `staff`, and `admin`
- Create, list, and delete tasks associated with each user
- Protect private routes based on the user's permission level

The app runs on FastAPI and creates database tables automatically at startup.

## Technology stack

- Python 3.x
- FastAPI
- SQLAlchemy (async)
- SQLite + aiosqlite
- Pydantic + Pydantic Settings
- JWT with python-jose
- Passlib (password hashing via Argon2)
- Pytest
- Uvicorn

## Architecture used

This project follows a layered architecture inspired by the Service + Repository pattern, with clear separation of responsibilities:

- API layer: route definitions and HTTP handling in `app/api`
- Service layer: business logic in `app/services`
- Repository layer: database access in `app/db/repositories`
- Model layer: SQLAlchemy entities in `app/db/models`
- Core layer: configuration, dependencies, enums, and security helpers in `app/core`
- Database layer: connection/session configuration in `app/db/session.py`

This separation makes the project easier to extend, test, and maintain. The application logic is not embedded directly in the endpoints; instead, routes delegate to service classes, which interact with repository classes and the database models.

## Project structure

```text
project_1/
├── app/
│   ├── api/
│   │   ├── router.py
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py
│   │       │   ├── health.py
│   │       │   ├── task.py
│   │       │   └── user.py
│   │       └── schemas/
│   │           ├── auth.py
│   │           ├── health.py
│   │           ├── task.py
│   │           ├── token.py
│   │           └── user.py
│   ├── core/
│   │   ├── config.py
│   │   ├── deps.py
│   │   ├── enums.py
│   │   └── security.py
│   ├── db/
│   │   ├── base.py
│   │   ├── fake_db.py
│   │   ├── models/
│   │   │   ├── task.py
│   │   │   └── user.py
│   │   ├── repositories/
│   │   │   ├── task_repo.py
│   │   │   └── user_repo.py
│   │   ├── session.py
│   │   └── __init__.py
│   ├── services/
│   │   ├── agent_service.py
│   │   ├── task_service.py
│   │   ├── user_service.py
│   │   └── __init__.py
│   ├── main.py
│   └── __init__.py
├── tests/
│   ├── conftest.py
│   ├── integration/
│   │   ├── test_health.py
│   │   └── user_test.py
│   └── unit/
│       └── test_task_repo.py
├── .env
├── .gitignore
├── pytest.ini
├── requirements.txt
├── sql_app.db
├── temporal_change_role.py
└── README.md
```

## Data model

The database contains two primary entities:

### User

Represents a system user with the following fields:

- `id`
- `email` (unique)
- `hashed_password`
- `full_name`
- `is_active`
- `created_at`
- `role` (`user`, `staff`, `admin`)

Each user may own multiple tasks.

### Task

Represents a user task with the following fields:

- `id`
- `title`
- `description`
- `completed`
- `owner_id` (foreign key to `users.id`)

## Main endpoints

The API is mounted under the `/api/v1` prefix.

### Health

- `GET /api/v1/health` → returns the service status

### Authentication

- `POST /api/v1/auth/login` → authenticates a user and returns a JWT

### Users

- `POST /api/v1/users` → creates a user
- `GET /api/v1/users` → lists users
- `GET /api/v1/users/{user_id}` → gets a user by ID
- `GET /api/v1/users/me` → returns the authenticated user's profile
- `DELETE /api/v1/users/{user_id}` → deletes a user
- `PATCH /api/v1/users/{user_id}/role` → changes a user's role (admin only)
- `GET /api/v1/users/adm` → admin-only users listing
- `GET /api/v1/users/admin/dashboard` → protected admin dashboard

### Tasks

- `POST /api/v1/tasks/` → creates a task for the authenticated user
- `GET /api/v1/tasks/` → lists the current user's tasks or all tasks for admin/staff
- `DELETE /api/v1/tasks/{task_id}` → deletes a task if authorized

## Security

The application uses JWT to protect private routes and Argon2 for password hashing.

Security-related modules include:

- `app/core/security.py`
- `app/core/deps.py`
- `app/core/config.py`

Password hashes are generated with `argon2.PasswordHasher` and verified with the same library, which is more resistant to GPU-based attacks than legacy algorithms such as bcrypt. Tokens are generated using the secret defined in `.env` and validated on each authenticated request. Role-based access is enforced through dependency functions that check the user's role.

## Environment variables

The project uses a `.env` file for base configuration. A typical example is:

```env
SECRET_KEY="wrld999"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=15
```

In production, it is recommended to use a strong secret key and avoid committing secrets to public repositories.

## Local installation

1. Clone the repository.
2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate it:

Windows (PowerShell):

```powershell
.\venv\Scripts\Activate.ps1
```

Linux/macOS:

```bash
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Make sure the `.env` file is configured.

## Running the application

```bash
uvicorn app.main:app --reload
```

Interactive API docs are available at:

- Swagger UI: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`

## Running tests

```bash
pytest
```

The project includes integration tests for service health and basic workflows using an in-memory SQLite database.

## Notes

- The development database is stored in `sql_app.db`.
- On startup, `Base.metadata.create_all` creates the tables automatically.
- The project is structured to grow with more modules, repositories, and services while keeping a clear separation of responsibilities.

## Project goal

This backend serves as a solid foundation for a user and task management API with authentication, role control, and database persistence. It is a good starting point for more complex FastAPI applications, including business services, admin dashboards, access control systems, and APIs with more advanced business logic.
