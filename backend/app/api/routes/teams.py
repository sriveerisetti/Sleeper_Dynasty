"""Team / roster endpoints."""
from fastapi import APIRouter

from app.core.config import settings
from app.services.sleeper_client import SleeperClient

router = APIRouter()


@router.get("/")
async def get_all_teams():
    """All rosters with their owners."""
    async with SleeperClient() as client:
        rosters = await client.get_league_rosters(settings.SLEEPER_LEAGUE_ID)
        users = await client.get_league_users(settings.SLEEPER_LEAGUE_ID)

    users_by_id = {u["user_id"]: u for u in users}
    return [
        {
            "roster_id": r["roster_id"],
            "owner": users_by_id.get(r.get("owner_id")),
            "co_owners": [users_by_id.get(uid) for uid in (r.get("co_owners") or [])],
            "settings": r.get("settings"),
            "players": r.get("players") or [],
            "starters": r.get("starters") or [],
            "reserve": r.get("reserve") or [],
            "taxi": r.get("taxi") or [],
        }
        for r in rosters
    ]


@router.get("/{roster_id}")
async def get_team(roster_id: int):
    """Single roster by Sleeper roster_id."""
    async with SleeperClient() as client:
        rosters = await client.get_league_rosters(settings.SLEEPER_LEAGUE_ID)
        for r in rosters:
            if r["roster_id"] == roster_id:
                return r
    return {"error": "roster not found"}


@router.get("/{roster_id}/by-position")
async def get_team_by_position(roster_id: int):
    """Roster broken down by position (QB/RB/WR/TE/K/DEF)."""
    async with SleeperClient() as client:
        rosters = await client.get_league_rosters(settings.SLEEPER_LEAGUE_ID)
        all_players = await client.get_all_players()

    roster = next((r for r in rosters if r["roster_id"] == roster_id), None)
    if not roster:
        return {"error": "roster not found"}

    positions: dict[str, list[dict]] = {"QB": [], "RB": [], "WR": [], "TE": [], "K": [], "DEF": [], "OTHER": []}
    for player_id in (roster.get("players") or []):
        player = all_players.get(player_id)
        if not player:
            continue
        pos = player.get("position", "OTHER")
        bucket = pos if pos in positions else "OTHER"
        positions[bucket].append({
            "player_id": player_id,
            "name": player.get("full_name") or f"{player.get('first_name','')} {player.get('last_name','')}".strip(),
            "team": player.get("team"),
            "age": player.get("age"),
            "years_exp": player.get("years_exp"),
        })
    return {"roster_id": roster_id, "positions": positions}
