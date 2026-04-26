# Setup Guide

## Prerequisites

- **Python 3.11+** (`python --version`)
- **Node.js 20+** and npm (`node --version`)
- **PostgreSQL** — easiest via [Supabase](https://supabase.com) (free tier works)
- A code editor — VS Code recommended (we ship configs in `.vscode/`)

## 1. Clone & install

```bash
git clone <your-repo-url> sleeper-dynasty-league
cd sleeper-dynasty-league
```

When VS Code opens the folder, accept the prompt to install recommended extensions.

## 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Project Settings → Database → copy the **Connection string (URI)**. Use the *Session pooler* string for app traffic.
3. Project Settings → API → copy your **Project URL**, **anon key**, and **service_role key**.

## 3. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env with your Supabase + league values
```

Run migrations to create the expansion-draft tables:

```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

Start the API:

```bash
uvicorn app.main:app --reload
```

Sanity check:

- API docs: <http://localhost:8000/docs>
- Health: <http://localhost:8000/health>
- League info: <http://localhost:8000/api/league/>

## 4. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — point VITE_SUPABASE_* at your Supabase project
npm run dev
```

App runs at <http://localhost:5173>. Vite proxies `/api/*` → backend, so you can leave `VITE_API_BASE_URL` unset for local dev.

## 5. Run both at once (VS Code)

`Run and Debug` → pick **Run Full Stack**. Backend and frontend launch together.

## 6. Daily player sync

Sleeper's `/players/nfl` is huge (~5MB) and should not be hit on every request. Run this once a day:

```bash
cd backend
python scripts/sync_players.py
```

On Railway, schedule it as a cron job. Locally you can use `cron` or skip it — the API will still call Sleeper directly while developing.

## Deployment

- **Frontend → Vercel:** import the repo, set root directory to `frontend/`, set env vars `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- **Backend → Railway:** import the repo, root `backend/`, Railway picks up `Dockerfile` and `railway.json`. Set all env vars from `.env.example`. After deploy, copy the public URL into Vercel's `VITE_API_BASE_URL`.

## Troubleshooting

- **`alembic` says no changes detected**: make sure `app/models/__init__.py` imports every model.
- **CORS errors**: add your frontend URL to `CORS_ORIGINS` in the backend `.env` (comma-separated).
- **Sleeper API 404**: double-check `SLEEPER_LEAGUE_ID` in `backend/.env`.
- **Empty stats**: stats compute from real matchups — pre-season the lists will be empty.
