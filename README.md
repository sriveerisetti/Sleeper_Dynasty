# Sleeper Dynasty League Website

A custom website for our Sleeper dynasty fantasy football league, featuring stats, rivalries, and an expansion draft tool that Sleeper doesn't natively support.

## Architecture

This is a monorepo with two main applications:

- **`frontend/`** — React + Vite + Tailwind CSS + Recharts
- **`backend/`** — FastAPI (Python) + PostgreSQL via Supabase

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Frontend     | React, Vite, Tailwind CSS, Recharts     |
| Backend      | FastAPI, Python 3.11+                   |
| Database     | PostgreSQL (Supabase)                   |
| ORM          | SQLAlchemy + Alembic                    |
| Hosting      | Vercel (frontend), Railway (backend)    |
| External API | Sleeper API, FantasyCalc API            |

## League Info

- **League ID:** `1352020902253953024`
- **Platform:** Sleeper

## Quick Start

See [`docs/SETUP.md`](docs/SETUP.md) for detailed setup instructions.

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

## Features (MVP)

1. **Home** — League info, dynasty FF intro, rules
2. **Stats** — Overview (top players, rivalries, blowouts, etc.) + Teams (rosters by position)
3. **Expansion Draft** — Custom draft board with real-time updates

## Future Roadmap

- Power rankings
- Luck index
- Weekly recap
- League records
- Individual team pages
