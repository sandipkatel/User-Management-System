
# Fullstack FastAPI + Next.js Application

This repository contains a fullstack web application with a **FastAPI backend** and a **Next.js frontend**, designed to run locally or inside Docker containers with environment-based API routing.

---

## Features

- **FastAPI backend**
  - REST API with authentication endpoints (`/auth/login`, `/auth/signup`, etc.)
  - User management routes (`/users`, `/users/{id}`, etc.)
  - CORS enabled for frontend integration
- **Next.js frontend**
  - React-based UI with authentication forms and user management
  - Axios instance configured for dynamic API base URL via environment variables
- **Docker Compose setup**
  - Runs backend and frontend services in isolated containers on a shared network
  - Handles cross-service communication via Docker network hostnames
- **Environment-aware API routing**
  - Frontend automatically adjusts API base URL depending on environment (local or Docker)
  - Uses `.env` and `docker-compose.yml` environment variables for configuration

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (for local frontend development without Docker)
- Python 3.9+ (for local backend development without Docker)

### Running Locally (without Docker)

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
````

#### Frontend

Create `.env.local` in the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000)

---

### Running with Docker Compose

Build and start the services:

```bash
docker-compose up --build
```

* Backend API: `http://localhost:8000`
* Frontend app: `http://localhost:3000`

---

## Environment Variables

| Variable              | Description                                             | Used In  |
| --------------------- | ------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API                             | Frontend |
| `DATABASE_URL`        | Database connection URL (e.g., `sqlite:///auth_app.db`) | Backend  |

* Set `NEXT_PUBLIC_API_URL` to `http://localhost:8000` for local development.
* Inside Docker, frontend uses `http://backend:8000` (set in `docker-compose.yml`).

---

## API Endpoints

### Authentication

* `POST /auth/login` — Login user (returns access token)
* `POST /auth/signup` — Register new user
* `POST /auth/logout` — Logout user
* `POST /auth/forgot-password` — Initiate password reset
* `POST /auth/reset-password` — Reset password using token

### Users

* `GET /users` — List users
* `GET /users/me` — Get current authenticated user
* `GET /users/{id}` — Get user by ID
* `PUT /users/{id}` — Update user by ID
* `DELETE /users/{id}` — Delete user by ID

---

