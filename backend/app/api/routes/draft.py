# This is a FAST API Router that defines 3 HTTP endpoints. When the frontend 
# makes a request to a URL, FAST API matches that to one of these functions and runs it 

# Here we add the funciton where users can mark players as availabe, protectred. The 
# front end pulls team and plauyer data live from Sleeper using the API and then we have a flag 
# system for available and non available TRUE/FALSE 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db

# Bring in the PlayerAvailability class 
from app.models.draft import PlayerAvailability
from app.schemas.draft import PlayerAvailabilityRead, ToggleRequest

# Wrapper around sleeper fantasy football API 
from app.services.sleeper_client import SleeperClient

# FAST APIs way of grouping related endpoints into a module 
router = APIRouter()



@router.get("/availability", response_model=list[PlayerAvailabilityRead])
def get_all_availability(db: Session = Depends(get_db)):
    """
    Purpose: When someone hits the GET/availability, it queries the player_availability 
    table for every row matching the league ID configured in settings and retunrs them 
    """
    return (
        db.query(PlayerAvailability)
        # SET in settings 
        .filter(PlayerAvailability.league_id == settings.SLEEPER_LEAGUE_ID)
        .all()
    )


@router.post("/availability", response_model=PlayerAvailabilityRead)
def toggle_availability(payload: ToggleRequest, db: Session = Depends(get_db)):
    """
    Purpose: Upsert. We will update if exxists, otherwise insert. 
    1. Look in the database to find a row matching the league id, roster id, and player id 
    2. If row exists, then we update the is_available field 
    
    """
    record = (
        db.query(PlayerAvailability)
        .filter(
            PlayerAvailability.league_id == settings.SLEEPER_LEAGUE_ID,
            PlayerAvailability.roster_id == payload.roster_id,
            PlayerAvailability.player_id == payload.player_id,
        )
        .first()
    )

    # If the record exists, then we simply update the is_available field 
    if record:
        record.is_available = payload.is_available
    else:
        # If not, then we build a new PlayerAvailability row with the information 
        # Using db.add()
        record = PlayerAvailability(
            league_id=settings.SLEEPER_LEAGUE_ID,
            roster_id=payload.roster_id,
            player_id=payload.player_id,
            is_available=payload.is_available,
        )
        db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/rosters")
async def get_all_rosters_with_players():
    """
    Purpose: Get all roster information using the Sleeper API
    """
    async with SleeperClient() as client:
        # Get all league rosters, users, and plauers 
        # Gives the raw rosters, which roster ID downs which player Ids
        rosters = await client.get_league_rosters(settings.SLEEPER_LEAGUE_ID)
        # Gives the team owners (names and custom team names)
        users = await client.get_league_users(settings.SLEEPER_LEAGUE_ID)
        # Gives the master player database (name, position, NFL team, age)
        all_players = await client.get_all_players()

    # Sleeper gives us these 3 pieces (rosters, users, all_players) seperately 
    # so we stitch them together into one JSON payload 
    users_by_id = {u["user_id"]: u for u in users}

    # Empty dictionary 
    result = []

    # Assign the team name, metadata, and team name from the information 
    # we get from Sleeper
    for r in rosters:
        owner = users_by_id.get(r.get("owner_id"))
        team_name = None

        # If there is an owner get the metadata and team name information 
        if owner:
            metadata = owner.get("metadata") or {}
            team_name = metadata.get("team_name") or owner.get("display_name")

        # For each player in the payload dictionary we update a players dictionary 
        # that is empty Get the player id information and then 
        players = []
        for player_id in (r.get("players") or []):
            p = all_players.get(player_id) or {}
            players.append({
                "player_id": player_id,
                "name": p.get("full_name")
                or f"{p.get('first_name','')} {p.get('last_name','')}".strip()
                or player_id,
                "position": p.get("position") or "—",
                "team": p.get("team") or "FA",
                "age": p.get("age"),
                "years_exp": p.get("years_exp"),
            })

        # Append information properly to the result dictionary 
        result.append({
            "roster_id": str(r["roster_id"]),
            "team_name": team_name or f"Team {r['roster_id']}",
            "owner_name": owner.get("display_name") if owner else None,
            "player_count": len(players),
            "players": players,
        })
    return result
