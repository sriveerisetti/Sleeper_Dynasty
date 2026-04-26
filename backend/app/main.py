"""FastAPI application entrypoint."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import draft, league, stats, teams
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Sleeper Dynasty League API",
    description="Backend API for the dynasty fantasy football league website.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(league.router, prefix="/api/league", tags=["league"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(draft.router, prefix="/api/draft", tags=["draft"])


@app.get("/")
async def root():
    return {"status": "ok", "service": "sleeper-dynasty-league-api"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
