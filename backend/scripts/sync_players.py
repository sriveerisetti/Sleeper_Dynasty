"""Run once daily to cache the all-players blob from Sleeper.

Sleeper's `/players/nfl` endpoint returns ~5MB; their docs ask you not to hammer it.
Run this on a cron (e.g. Railway scheduled job) and store the output to disk or DB.

Usage:
    python scripts/sync_players.py
"""
import asyncio
import json
from pathlib import Path

from app.services.sleeper_client import SleeperClient


async def main():
    out_path = Path("data/players.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    async with SleeperClient() as client:
        players = await client.get_all_players()
    out_path.write_text(json.dumps(players))
    print(f"Wrote {len(players)} players to {out_path}")


if __name__ == "__main__":
    asyncio.run(main())
