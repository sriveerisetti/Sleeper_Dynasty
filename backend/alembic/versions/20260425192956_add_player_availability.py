"""add player_availability table

Revision ID: 20260425192956
Revises:
Create Date: 2026-04-25 19:29:56
"""
from alembic import op
import sqlalchemy as sa

revision = '20260425192956'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'player_availability',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('league_id', sa.String(), nullable=False, index=True),
        sa.Column('roster_id', sa.String(), nullable=False, index=True),
        sa.Column('player_id', sa.String(), nullable=False, index=True),
        sa.Column('is_available', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.UniqueConstraint('league_id', 'roster_id', 'player_id', name='uq_league_roster_player'),
    )


def downgrade() -> None:
    op.drop_table('player_availability')
