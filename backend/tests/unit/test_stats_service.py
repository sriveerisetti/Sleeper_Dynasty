"""Tests for stats_service computations."""
from app.services import stats_service


def _matchup(week, mid, rid, pts, season="2024", lid="L1"):
    return {
        "week": week,
        "matchup_id": mid,
        "roster_id": rid,
        "points": pts,
        "season": season,
        "league_id": lid,
    }


def test_pair_matchups_pairs_by_matchup_id():
    matchups = [
        _matchup(1, 1, 1, 100.0),
        _matchup(1, 1, 2, 90.0),
        _matchup(1, 2, 3, 110.0),
        _matchup(1, 2, 4, 105.0),
    ]
    pairs = stats_service.pair_matchups(matchups)
    assert len(pairs) == 2


def test_pair_matchups_separates_by_league():
    """Same matchup_id and week in different seasons must NOT be paired."""
    matchups = [
        _matchup(1, 1, 1, 100.0, season="2024", lid="L1"),
        _matchup(1, 1, 2, 90.0, season="2024", lid="L1"),
        _matchup(1, 1, 3, 100.0, season="2025", lid="L2"),
        _matchup(1, 1, 4, 90.0, season="2025", lid="L2"),
    ]
    pairs = stats_service.pair_matchups(matchups)
    assert len(pairs) == 2


def test_compute_rivalries_basic():
    paired = [
        (_matchup(1, 1, 1, 100.0), _matchup(1, 1, 2, 90.0)),
        (_matchup(2, 1, 1, 80.0), _matchup(2, 1, 2, 95.0)),
    ]
    rivalries = stats_service.compute_rivalries(paired)
    assert len(rivalries) == 1
    r = rivalries[0]
    assert r["games_played"] == 2
    assert r["team_a_wins"] + r["team_b_wins"] == 2


def test_closest_games_sorts_by_smallest_margin():
    paired = [
        (_matchup(1, 1, 1, 100.0), _matchup(1, 1, 2, 50.0)),
        (_matchup(2, 1, 3, 100.0), _matchup(2, 1, 4, 99.0)),
    ]
    closest = stats_service.closest_games(paired, n=2)
    assert closest[0]["margin"] == 1.0
    assert closest[1]["margin"] == 50.0


def test_heated_rivalries_threshold_is_one_game():
    """A single head-to-head should still appear in heated rivalries."""
    paired = [
        (_matchup(1, 1, 1, 100.0), _matchup(1, 1, 2, 99.0)),
    ]
    rivalries = stats_service.compute_rivalries(paired)
    heated = stats_service.heated_rivalries(rivalries)
    assert len(heated) == 1
