"""Pydantic schemas for league-level data."""
from pydantic import BaseModel


class LeagueInfo(BaseModel):
    league_id: str
    name: str
    season: str
    status: str
    total_rosters: int
    settings: dict
    scoring_settings: dict


class LeagueUser(BaseModel):
    user_id: str
    username: str | None
    display_name: str
    avatar: str | None
