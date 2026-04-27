"""Stats endpoints — computed from Sleeper matchup data across all seasons."""
from fastapi import APIRouter

from app.core.config import settings
from app.services import stats_service
from app.services.sleeper_client import SleeperClient

router = APIRouter()


async def _load_paired_matchups():
    """
    Purpose Fetch all matchups across the entire league history.
    """
    async with SleeperClient() as client:
        # Use the get_all_matchups_all_season() to get all matchips availab e
        all_matchups, chain = await stats_service.get_all_matchups_all_seasons(
            client, settings.SLEEPER_LEAGUE_ID
        )
    return stats_service.pair_matchups(all_matchups), chain


async def _build_team_lookup() -> dict[str, str]:
    """Map roster_id (str) -> team display name (owner display name).

    Sleeper's team names live on the user, not the roster. We build the map
    from the *current* league because rosters can move between owners across
    seasons.
    """
    async with SleeperClient() as client:
        # Team names lives on the Users table. Use the get_league_users and get_league_rosters 
        # functions inorder to properly pick up team information 
        users = await client.get_league_users(settings.SLEEPER_LEAGUE_ID)
        rosters = await client.get_league_rosters(settings.SLEEPER_LEAGUE_ID)
    users_by_id = {u["user_id"]: u for u in users}
    lookup: dict[str, str] = {}
    
    # For each roster in the rosters variable, we get the owner, team name, etc. 
    for r in rosters:
        owner = users_by_id.get(r.get("owner_id"))
        # Prefer team name set in metadata, fall back to display_name
        team_name = None
        if owner:
            metadata = owner.get("metadata") or {}
            team_name = metadata.get("team_name") or owner.get("display_name")
        lookup[str(r["roster_id"])] = team_name or f"Team {r['roster_id']}"
    return lookup


def _attach_names(items: list[dict], lookup: dict[str, str], keys: list[str]) -> list[dict]:
    """Add a `_name` suffix field for each id key (e.g. team_a_id -> team_a_name)."""
    out = []
    for item in items:
        new = dict(item)
        for k in keys:
            base = k.removesuffix("_id")
            new[f"{base}_name"] = lookup.get(str(item.get(k)), f"Team {item.get(k)}")
        out.append(new)
    return out


@router.get("/overview")
async def get_overview():
    """
    Purpose: Critial function that calculates information about the key stats that we 
    show on the Stats page 
    """
    paired, chain = await _load_paired_matchups()
    lookup = await _build_team_lookup()
    rivalries = stats_service.compute_rivalries(paired)

    # Get information about the seasons, total matchups, teams, heated rivalries, 
    # lopsided rivalries, closest games, biggest blowouts, current form, clutch performers 
    regular_season = [p for p in paired if not p[0].get("is_playoff")]
    playoff = [p for p in paired if p[0].get("is_playoff")]

    return {
        "seasons_loaded": [c.get("season") for c in chain],
        "total_matchups": len(paired),
        "regular_season_matchups": len(regular_season),
        "playoff_matchups": len(playoff),
        "team_names": lookup,
        "heated_rivalries": _attach_names(
            stats_service.heated_rivalries(rivalries), lookup, ["team_a_id", "team_b_id"]
        ),
        "lopsided_rivalries": _attach_names(
            stats_service.lopsided_rivalries(rivalries), lookup, ["team_a_id", "team_b_id"]
        ),
        "closest_games": _attach_names(
            stats_service.closest_games(paired), lookup, ["team_a_id", "team_b_id"]
        ),
        "biggest_blowouts": _attach_names(
            stats_service.biggest_blowouts(paired), lookup, ["team_a_id", "team_b_id"]
        ),
        "current_form": _attach_names(
            stats_service.current_form(paired), lookup, ["team_id"]
        ),
        "clutch_performers": _attach_names(
            stats_service.clutch_performers(paired), lookup, ["team_id"]
        ),
    }


@router.get("/rivalries")
async def get_rivalries():
    """
    Purpose: Get informatiobn about rivalries using the functions that we built in the 
    first function 
    """
    paired, _ = await _load_paired_matchups()
    lookup = await _build_team_lookup()

    # use the compute rivalries function 
    rivalries = stats_service.compute_rivalries(paired)
    return _attach_names(rivalries, lookup, ["team_a_id", "team_b_id"])


@router.get("/recent-games")
async def get_recent_games(limit: int = 10):
    """
    Purpose: Limit to the last 10 returns 
    # Use the _load_paired_matchups() and _build_team_lookup() to get 
    key information on the games we have had in the last 10 weeks 
    """
    paired, _ = await _load_paired_matchups()
    lookup = await _build_team_lookup()
    games = [
        {
            "season": a.get("season"),
            "week": a["week"],
            "team_a_id": str(a["roster_id"]),
            "team_b_id": str(b["roster_id"]),
            "team_a_score": a["points"],
            "team_b_score": b["points"],
        }
        for a, b in paired
    ]
    # Sort reverse style from latest to earliest 
    games.sort(key=lambda g: (g.get("season") or "", g["week"]), reverse=True)
    return _attach_names(games[:limit], lookup, ["team_a_id", "team_b_id"])


@router.get("/_debug")
async def debug_data():
    """
    Diagnostic 
    """
    async with SleeperClient() as client:
        all_matchups, chain = await stats_service.get_all_matchups_all_seasons(
            client, settings.SLEEPER_LEAGUE_ID
        )
    paired = stats_service.pair_matchups(all_matchups)
    return {
        "league_chain": [
            {"league_id": c["league_id"], "season": c.get("season"), "name": c.get("name")}
            for c in chain
        ],
        "raw_matchup_rows": len(all_matchups),
        "paired_matchups": len(paired),
        "sample_paired": [
            {
                "season": a.get("season"),
                "week": a["week"],
                "team_a": a["roster_id"],
                "score_a": a["points"],
                "team_b": b["roster_id"],
                "score_b": b["points"],
            }
            for a, b in paired[:3]
        ],
    }
