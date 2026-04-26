"""Application configuration loaded from environment variables."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    # League
    SLEEPER_LEAGUE_ID: str

    # Database
    DATABASE_URL: str
    DIRECT_URL: str = ""

    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # External APIs
    SLEEPER_API_BASE_URL: str = "https://api.sleeper.app/v1"
    FANTASYCALC_API_BASE_URL: str = "https://api.fantasycalc.com"

    # App
    APP_ENV: str = "development"
    APP_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173"

    # Auth
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    @property
    def CORS_ORIGINS_LIST(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
