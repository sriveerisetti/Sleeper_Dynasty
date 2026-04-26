"""Import all models so Alembic can detect them."""
from app.models.draft import PlayerAvailability

__all__ = ["PlayerAvailability"]
