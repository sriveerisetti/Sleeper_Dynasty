"""Business logic for computing league stats.

Walks the Sleeper `previous_league_id` chain so we get every season's matchups,
not just the current one. Sleeper creates a NEW league ID each season; the
current league points back at last season via `previous_league_id`.
"""
from collections import defaultdict

from app.services.sleeper_client import SleeperClient


async def collect_league_chain(client: SleeperClient, league_id: str) -> list[dict]:
    """Walk previous_league_id back through every prior season.

    Returns a list of league objects, ordered current -> oldest.
    """
    chain = []
    current_id = league_id
    while current_id and current_id != "0":
        league = await client.get_league(current_id)
        if not league:
            break
        chain.append(league)
        current_id = league.get("previous_league_id")
    return chain


async def get_matchups_for_league(
    client: SleeperClient, league_id: str, max_week: int = 18
) -> list[dict]:
    """Fetch all matchups for a single league across all weeks.

    Sleeper returns an empty list for weeks that haven't been played; we keep
    going until we've checked the playoff window. Tags each matchup with its
    week and source league_id.
    """
    all_matchups = []
    for week in range(1, max_week + 1):
        try:
            weekly = await client.get_matchups(league_id, week)
        except Exception:
            continue
        if not weekly:
            continue
        # Skip weeks where no points have been scored yet (future weeks)
        if all(m.get("points", 0) == 0 for m in weekly):
            continue
        for m in weekly:
            m["week"] = week
            m["league_id"] = league_id
        all_matchups.extend(weekly)
    return all_matchups


async def get_all_matchups_all_seasons(
    client: SleeperClient, league_id: str
) -> tuple[list[dict], list[dict]]:
    """Get matchups from current league + every prior season.

    Returns (matchups, league_chain). league_chain is useful for tagging
    seasons in the response.
    """
    chain = await collect_league_chain(client, league_id)
    all_matchups = []
    for league in chain:
        season_matchups = await get_matchups_for_league(client, league["league_id"])
        for m in season_matchups:
            m["season"] = league.get("season")
        all_matchups.extend(season_matchups)
    return all_matchups, chain


def pair_matchups(matchups: list[dict]) -> list[tuple[dict, dict]]:
    """Sleeper returns matchups as a flat list keyed by matchup_id; pair them.

    Now also keys on league_id so matchups from different seasons don't collide.
    """
    by_matchup: dict[tuple, list[dict]] = defaultdict(list)
    for m in matchups:
        key = (m.get("league_id"), m["week"], m["matchup_id"])
        by_matchup[key].append(m)
    return [tuple(pair) for pair in by_matchup.values() if len(pair) == 2]


def compute_rivalries(paired_matchups: list[tuple[dict, dict]]) -> list[dict]:
    """Aggregate head-to-head records between every pair of teams across all seasons."""
    h2h: dict[tuple[int, int], dict] = {}
    for a, b in paired_matchups:
        ids = tuple(sorted([a["roster_id"], b["roster_id"]]))
        if ids not in h2h:
            h2h[ids] = {
                "team_a_id": str(ids[0]),
                "team_b_id": str(ids[1]),
                "team_a_wins": 0,
                "team_b_wins": 0,
                "games_played": 0,
                "total_margin": 0.0,
                "total_points": 0.0,
            }
        rec = h2h[ids]
        rec["games_played"] += 1
        rec["total_points"] += a["points"] + b["points"]
        margin = abs(a["points"] - b["points"])
        rec["total_margin"] += margin
        if a["points"] == b["points"]:
            continue  # tie - no win credited
        winner = a if a["points"] > b["points"] else b
        if winner["roster_id"] == ids[0]:
            rec["team_a_wins"] += 1
        else:
            rec["team_b_wins"] += 1

    results = []
    for rec in h2h.values():
        rec["avg_margin"] = rec["total_margin"] / rec["games_played"] if rec["games_played"] else 0
        results.append(rec)
    return results


def heated_rivalries(rivalries: list[dict], min_games: int = 1) -> list[dict]:
    """Closest matchups: balanced records first, then small avg margin."""
    qualifying = [r for r in rivalries if r["games_played"] >= min_games]
    return sorted(
        qualifying,
        key=lambda r: (abs(r["team_a_wins"] - r["team_b_wins"]), r["avg_margin"]),
    )[:5]


def lopsided_rivalries(rivalries: list[dict], min_games: int = 2) -> list[dict]:
    """One-sided matchups: biggest win-disparity first."""
    qualifying = [r for r in rivalries if r["games_played"] >= min_games]
    return sorted(
        qualifying,
        key=lambda r: -abs(r["team_a_wins"] - r["team_b_wins"]),
    )[:5]


def closest_games(paired_matchups: list[tuple[dict, dict]], n: int = 5) -> list[dict]:
    games = [
        {
            "season": a.get("season"),
            "week": a["week"],
            "team_a_id": str(a["roster_id"]),
            "team_b_id": str(b["roster_id"]),
            "team_a_score": a["points"],
            "team_b_score": b["points"],
            "margin": abs(a["points"] - b["points"]),
        }
        for a, b in paired_matchups
        if a.get("points") is not None and b.get("points") is not None
    ]
    return sorted(games, key=lambda g: g["margin"])[:n]


def biggest_blowouts(paired_matchups: list[tuple[dict, dict]], n: int = 5) -> list[dict]:
    games = [
        {
            "season": a.get("season"),
            "week": a["week"],
            "team_a_id": str(a["roster_id"]),
            "team_b_id": str(b["roster_id"]),
            "team_a_score": a["points"],
            "team_b_score": b["points"],
            "margin": abs(a["points"] - b["points"]),
        }
        for a, b in paired_matchups
        if a.get("points") is not None and b.get("points") is not None
    ]
    return sorted(games, key=lambda g: -g["margin"])[:n]


def current_form(paired_matchups: list[tuple[dict, dict]], last_n: int = 5) -> list[dict]:
    """Each team's most recent W/L results.

    Sorts within each team by (season DESC, week DESC) so 'last 5' really means
    the most recent across all seasons.
    """
    by_team: dict[int, list[tuple]] = defaultdict(list)
    for a, b in paired_matchups:
        season = a.get("season") or "0"
        a_won = a["points"] > b["points"]
        b_won = b["points"] > a["points"]
        a_result = "W" if a_won else ("L" if b_won else "T")
        b_result = "W" if b_won else ("L" if a_won else "T")
        by_team[a["roster_id"]].append((season, a["week"], a_result, a["points"]))
        by_team[b["roster_id"]].append((season, b["week"], b_result, b["points"]))

    results = []
    for team_id, games in by_team.items():
        games.sort(key=lambda g: (g[0], g[1]), reverse=True)
        recent = games[:last_n]
        results.append({
            "team_id": str(team_id),
            "last_5": [g[2] for g in recent],
            "points_last_5": sum(g[3] for g in recent),
        })
    return results


def clutch_performers(paired_matchups: list[tuple[dict, dict]], threshold: float = 10.0) -> list[dict]:
    """Win-loss record in games decided by less than `threshold` points."""
    by_team: dict[int, dict] = defaultdict(lambda: {"wins": 0, "losses": 0})
    for a, b in paired_matchups:
        if a["points"] == b["points"]:
            continue
        if abs(a["points"] - b["points"]) > threshold:
            continue
        winner, loser = (a, b) if a["points"] > b["points"] else (b, a)
        by_team[winner["roster_id"]]["wins"] += 1
        by_team[loser["roster_id"]]["losses"] += 1

    results = []
    for team_id, rec in by_team.items():
        total = rec["wins"] + rec["losses"]
        results.append({
            "team_id": str(team_id),
            "one_score_record": f"{rec['wins']}-{rec['losses']}",
            "win_pct": rec["wins"] / total if total else 0.0,
        })
    return sorted(results, key=lambda r: -r["win_pct"])
