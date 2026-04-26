
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class PlayerAvailability(Base):
    """
    This is the database model for the expansion draft 
    A single player on a roster, marked available or protected.

    The default for a player NOT in this table is "protected" (red) — owners
    must explicitly opt players IN to the expansion-draft pool.
    """

    # Use the defined player_availability 
    __tablename__ = "player_availability"
    __table_args__ = (UniqueConstraint("league_id", "roster_id", "player_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    league_id: Mapped[str] = mapped_column(String, index=True)
    roster_id: Mapped[str] = mapped_column(String, index=True)
    player_id: Mapped[str] = mapped_column(String, index=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
