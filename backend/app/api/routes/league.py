"""League info endpoints."""
from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.services.sleeper_client import SleeperClient

# Define the router 
router = APIRouter()


@router.get("/")
async def get_league_info():
    """
    Purpose: Make sure to import the SleeperClient(). Using the get_league() function 
    we can get the sleeper ID using the settings.SLEEPER_LEAGUE_ID. 

    We set the league variable as this information. 
    """
    async with SleeperClient() as client:
        try:
            league = await client.get_league(settings.SLEEPER_LEAGUE_ID)
            return league
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Sleeper API error: {e}")


@router.get("/users")
async def get_league_users():
    """
    Purpose: Get the league users 
    """
    async with SleeperClient() as client:
        return await client.get_league_users(settings.SLEEPER_LEAGUE_ID)


@router.get("/state")
async def get_nfl_state():
    """
    Purpose: Get the latest NFL session information 
    """
    async with SleeperClient() as client:
        return await client.get_nfl_state()
