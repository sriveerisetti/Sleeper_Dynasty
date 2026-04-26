"""Async client for the Sleeper API.

Sleeper API docs: https://docs.sleeper.com/
No authentication required, public read-only endpoints.
"""
from typing import Any

import httpx

from app.core.config import settings


class SleeperClient:
    """Thin async wrapper over the Sleeper public API."""

    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or settings.SLEEPER_API_BASE_URL
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=15.0)

    async def close(self):
        await self._client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.close()

    async def _get(self, path: str) -> Any:
        resp = await self._client.get(path)
        resp.raise_for_status()
        return resp.json()

    # ---- League ----
    async def get_league(self, league_id: str) -> dict:
        return await self._get(f"/league/{league_id}")

    async def get_league_users(self, league_id: str) -> list[dict]:
        return await self._get(f"/league/{league_id}/users")

    async def get_league_rosters(self, league_id: str) -> list[dict]:
        return await self._get(f"/league/{league_id}/rosters")

    async def get_matchups(self, league_id: str, week: int) -> list[dict]:
        return await self._get(f"/league/{league_id}/matchups/{week}")

    async def get_winners_bracket(self, league_id: str) -> list[dict]:
        return await self._get(f"/league/{league_id}/winners_bracket")

    async def get_losers_bracket(self, league_id: str) -> list[dict]:
        return await self._get(f"/league/{league_id}/losers_bracket")

    async def get_transactions(self, league_id: str, week: int) -> list[dict]:
        return await self._get(f"/league/{league_id}/transactions/{week}")

    async def get_traded_picks(self, league_id: str) -> list[dict]:
        return await self._get(f"/league/{league_id}/traded_picks")

    # ---- Players ----
    async def get_all_players(self) -> dict[str, dict]:
        """WARNING: ~5MB response. Cache aggressively (Sleeper recommends daily)."""
        return await self._get("/players/nfl")

    async def get_trending(self, sport: str = "nfl", lookback_hours: int = 24, limit: int = 25) -> list[dict]:
        return await self._get(f"/players/{sport}/trending/add?lookback_hours={lookback_hours}&limit={limit}")

    # ---- State ----
    async def get_nfl_state(self) -> dict:
        return await self._get("/state/nfl")
