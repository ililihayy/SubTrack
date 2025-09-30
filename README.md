# SubTrack

SubTrack is a small full‑stack app: FastAPI backend + React frontend.

- Page “Random Data”: fetch mock/random Users, Companies, Subscriptions, edit, and save to DB
- Page “Data”: view, sort, inline‑edit and delete stored data;
- Docker Compose for one‑command run

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React (React Router)

## Quick Start (Docker)

Prereqs: Docker and Docker Compose

```bash
docker compose up --build
```

Services:

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

Environment variables (optional overrides):

- Backend
  - `DATABASE_URL` (default `sqlite:///app.db`)
  - `RANDOM_DATA_API_BASE` (default `https://random-data-api.com/api/v2`)
- Frontend
  - `REACT_APP_API_BASE` (default `http://localhost:8000`)

## Local Development

### Backend

Create a venv and install deps.

Windows (PowerShell):

```powershell
cd backend
py -m venv venv
./venv/Scripts/Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

macOS/Linux:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Run the API (hot‑reload):

```bash
cd backend
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

If your backend isn’t on `http://localhost:8000`, set:

```bash
# in frontend/.env
REACT_APP_API_BASE=http://127.0.0.1:8000
```

## API Overview

Random data proxy/save:

- `GET /random/users`
- `GET /random/companies`
- `GET /random/subscriptions` (mocked)
- `POST /random/users/save` (maps & saves selected fields)
- `POST /random/companies/save` (maps & saves selected fields)
- `POST /random/subscriptions/save` (requires at least one user and one company in DB)

CRUD:

- Users: `/users`
- Companies: `/companies`
- Subscriptions: `/subscriptions`


## Data Model (simplified)

- User: `first_name`, `last_name`, `email`, `phone_number?`, `address?`
- Company: `business_name`, `industry?`, `catch_phrase?`, `buzzword?`, `address?`
- Subscription: `plan`, `status?`, `payment_method?`, `term?`, `user_id?`, `company_id?`

Notes:

- `user_id` and `company_id` on Subscription can be null in responses; create requires valid IDs
- Timestamps are added automatically on all models

## Formatting

Python (Black):

```bash
python -m black backend/app
```

## Project Structure

```
backend/
  app/
    routers/ (users, companies, subscriptions, random)
    models/  (User, Company, Subscription)
    schemas/ (pydantic models)
    database.py, main.py
frontend/
  src/ (App, pages, styles)
docker-compose.yml
```
