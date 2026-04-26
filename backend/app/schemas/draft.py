"""Pydantic schemas for the expansion-draft availability."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PlayerAvailabilityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    roster_id: str
    player_id: str
    is_available: bool
    updated_at: datetime


class ToggleRequest(BaseModel):
    roster_id: str
    player_id: str
    is_available: bool
