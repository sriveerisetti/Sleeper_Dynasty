"""Pydantic schemas for stats endpoints."""
from pydantic import BaseModel


class TopPlayer(BaseModel):
    player_id: str
    name: str
    position: str
    team: str | None
    points: float
    owner_team_id: str | None


class GameResult(BaseModel):
    week: int
    season: int
    home_team_id: str
    away_team_id: str
    home_score: float
    away_score: float
    margin: float


class Rivalry(BaseModel):
    team_a_id: str
    team_b_id: str
    team_a_wins: int
    team_b_wins: int
    games_played: int
    avg_margin: float
    total_points: float


class TeamForm(BaseModel):
    team_id: str
    last_5: list[str]  # ['W','L','W','W','L']
    points_last_5: float


class ClutchStat(BaseModel):
    team_id: str
    one_score_record: str  # e.g. "5-2"
    win_pct: float
