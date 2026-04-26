
# The alembic folder is where Alembic is. This is the tool that will handle database 
# migrations for SQL Alchemy projects. This is like version control for the database schema. 
# Every time we add a column, create a table, or change something, alembic creates a script that will 
# record teh change 

# The env.py is the config point. Every time we run alembic upgrade head it tells alembic 
# 1. Where the database is 
# 2. What the tables should look like based on SQL Alchemy models 
# 3. How to run the migration (online vs offline )


from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import settings
from app.db.session import Base
from app.models import * 

config = context.config
migration_url = getattr(settings, "DIRECT_URL", None) or settings.DATABASE_URL
config.set_main_option("sqlalchemy.url", migration_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# This is where Alembic comapres agains the actual database when we run alembic revision -- autogenerate 
# It looks at what the code says the schema should bs vs what the database currently has. 
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Purpose: Alebmic does not connect to the database, it instead emits raw SQL to the 
    stdout file. 
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Purpose: We will mostly use this. Alembic connects to the database and runs the SQL command. 
    When we run alembic upgrade head, it connects to the database and executes the command. 
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

# Alembic executes the file. 
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
