
# This is the critical code that will connect the Python scripts to the actual database 
# There are 4 layers of SQL Alchemy 
# 1. Engine - low level connection manager that talks to PostGres 
# 2. Session Factory - Produces session 
# 3. Base - parent class for model definitions 
# 4. get_bd() - per request session FAST API uses 



# Postman sends an HTTP request — just a URL, method, headers, and JSON body. No knowledge of get_db or anything Python-related.
# FastAPI receives the request and matches it to your endpoint function (e.g. toggle_availability).
# FastAPI inspects that function's signature, sees db: Session = Depends(get_db), and says "ah, before I run this endpoint, I need to call get_db and pass the result in."
# get_db() runs — SessionLocal() builds a fresh session and borrows a connection from the pool. Now db is active.
# Your endpoint code runs with db already supplied — it executes queries through that session, which sends SQL over the borrowed connection to Supabase.
# Supabase returns rows, SQLAlchemy converts them into Python objects (instances of your PlayerAvailability model).
# Your endpoint returns those Python objects.
# FastAPI serializes them to JSON using the response_model schema (PlayerAvailabilityRead) and sends the HTTP response back to Postman.
# After the response is sent, finally: db.close() runs — the session is destroyed and the connection returns to the pool.

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings

# COnnection to the database. Has the connection pool 
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all ORM models."""


def get_db() -> Generator:
    """
    Purpose: FastAPI dependency that yields a database session.
    1. Fast API calls get_db() and runs it upo th yield 
    2. db = SessionLocal() is a fresh connection 
    3. yield_db is a session that is handed to the endpoint as a db arugment 
    4. The endpoint runs its logic 

    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
