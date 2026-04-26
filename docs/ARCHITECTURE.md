# Architecture

## High-level

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│  React Frontend │────▶│  FastAPI Backend │────▶│  Sleeper API   │
│  (Vercel)       │     │  (Railway)       │     │  FantasyCalc   │
└────────┬────────┘     └─────────┬────────┘     └────────────────┘
         │                        │
         │                        ▼
         │              ┌──────────────────┐
         └─────────────▶│    Supabase      │
                        │  Postgres + RT   │
                        └──────────────────┘
```

The frontend talks to two things:

1. **The FastAPI backend** for everything that involves computing or proxying Sleeper data, and for writing expansion-draft state.
2. **Supabase directly** for realtime subscriptions on the expansion-draft tables — Postgres NOTIFY → WebSocket.

## Why a backend at all?

We could in theory hit Sleeper from the browser, but:

- Stats computations (rivalries, blowouts, current form) need many Sleeper calls — better to centralize.
- Expansion-draft state is our own table; we want server-side validation and auth before writes.
- We can cache the giant `/players/nfl` blob server-side.

## Data flow patterns

### Sleeper-derived stats (read-only)

- React calls `/api/stats/overview`.
- FastAPI fetches all weekly matchups for the season from Sleeper.
- `stats_service.py` reshapes them into rivalries / blowouts / form / clutch.
- Response returns to React; rendered with Recharts/cards.

### Expansion draft (read + write + realtime)

- Commissioner creates a draft via `POST /api/draft/`.
- Picks are seeded (currently manual; future: automate from rookie-draft order or league standings).
- A user makes a pick via `POST /api/draft/{id}/picks/{n}` — backend writes to Supabase Postgres.
- Postgres triggers a WAL change → Supabase Realtime → all connected clients via WebSocket.
- `useRealtimeDraft` hook calls `refresh()` so the board updates without polling.

## Data sources

| Source | Use | Auth | Cache strategy |
|--------|-----|------|----------------|
| Sleeper API | League/users/rosters/matchups | None (public) | Daily for `/players/nfl`; per-request otherwise |
| FantasyCalc | Dynasty trade values | None | Daily |
| Supabase Postgres | Expansion draft state | Service-role on backend, anon on frontend | N/A (source of truth) |

## Models

Three tables in our DB (all prefixed `expansion_*` so we can add more domains later):

- `expansion_drafts` — the event itself
- `expansion_picks` — one row per pick slot
- `expansion_protections` — rows of (team, player) the team has protected

Sleeper IDs (`roster_id`, `player_id`) are stored as strings — never join them in SQL; we resolve through Sleeper's API or the cached players blob.

## Frontend folder structure

```
src/
├── App.jsx                    # router
├── main.jsx
├── components/
│   ├── common/                # spinner, error, etc.
│   ├── home/                  # hero, rules
│   ├── stats/                 # rivalries, games, form, clutch, rosters
│   ├── draft/                 # board, pick card, setup
│   └── layout/                # navbar, footer
├── hooks/                     # useFetch, useRealtimeDraft
├── pages/                     # one file per top-level route
├── services/                  # one wrapper per backend domain
├── styles/                    # global Tailwind entry
└── utils/                     # formatters, constants
```

## Backend folder structure

```
app/
├── main.py                    # FastAPI app + CORS + routers
├── api/routes/                # one router per domain
├── core/config.py             # pydantic settings
├── db/session.py              # SQLAlchemy engine + Base
├── models/                    # ORM models
├── schemas/                   # Pydantic models (request/response)
├── services/                  # external API clients + business logic
└── utils/
```

## Future scope

| Feature | Where it lands |
|---------|----------------|
| Power rankings | `services/rankings_service.py` + `/api/stats/rankings` |
| Luck index | Add to `stats_service.py` (compare actual vs expected wins) |
| Weekly recap | Cron job → write to a new `weekly_recaps` table |
| League records | Materialized view in Postgres + `/api/stats/records` |
| Team pages | `pages/Team.jsx` with route `/teams/:rosterId` |
