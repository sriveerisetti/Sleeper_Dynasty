"""Async client for the FantasyCalc dynasty values API.

FantasyCalc docs: https://www.fantasycalc.com/api-info
"""
from typing import Any

import httpx

from app.core.config import settings


class FantasyCalcClient:
    """Wrapper for the FantasyCalc public API."""

    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or settings.FANTASYCALC_API_BASE_URL
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=15.0)

    async def close(self):
        await self._client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.close()

    async def get_dynasty_values(
        self,
        is_dynasty: bool = True,
        num_qbs: int = 1,
        num_teams: int = 12,
        ppr: float = 1.0,
    ) -> list[dict[str, Any]]:
        """Get current dynasty trade values for all players."""
        params = {
            "isDynasty": str(is_dynasty).lower(),
            "numQbs": num_qbs,
            "numTeams": num_teams,
            "ppr": ppr,
        }
        resp = await self._client.get("/values/current", params=params)
        resp.raise_for_status()
        return resp.json()
