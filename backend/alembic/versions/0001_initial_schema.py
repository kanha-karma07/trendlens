"""initial schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-10-11 11:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('theme', sa.String(length=20), nullable=False, server_default='dark'),
        sa.Column('default_stock', sa.String(length=20), nullable=False, server_default='RELIANCE.NS'),
        sa.Column('default_horizon', sa.Integer(), nullable=False, server_default='15'),
        sa.Column('timezone', sa.String(length=50), nullable=False, server_default='Asia/Kolkata'),
        sa.Column('show_uncertainty', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('show_90_band', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('email_on_resolve', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. watchlist_items
    op.create_table(
        'watchlist_items',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('symbol', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'symbol', name='uq_user_watchlist_symbol'),
    )
    op.create_index(op.f('ix_watchlist_items_user_id'), 'watchlist_items', ['user_id'], unique=False)

    # 3. instruments
    op.create_table(
        'instruments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('symbol', sa.String(length=20), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('exchange', sa.String(length=10), nullable=False, server_default='NSE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_instruments_symbol'), 'instruments', ['symbol'], unique=True)

    # 4. candles
    op.create_table(
        'candles',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('symbol', sa.String(length=20), nullable=False),
        sa.Column('interval', sa.String(length=10), nullable=False),
        sa.Column('ts_start', sa.DateTime(timezone=True), nullable=False),
        sa.Column('open', sa.Float(), nullable=False),
        sa.Column('high', sa.Float(), nullable=False),
        sa.Column('low', sa.Float(), nullable=False),
        sa.Column('close', sa.Float(), nullable=False),
        sa.Column('volume', sa.BigInteger(), nullable=False, server_default='0'),
        sa.Column('source', sa.String(length=50), nullable=False, server_default='mock'),
        sa.Column('ingested_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('symbol', 'interval', 'ts_start', name='uq_candle_symbol_interval_ts'),
    )
    op.create_index(op.f('ix_candles_symbol'), 'candles', ['symbol'], unique=False)
    op.create_index('ix_candles_symbol_interval_ts', 'candles', ['symbol', 'interval', 'ts_start'], unique=False)

    # 5. model_versions
    op.create_table(
        'model_versions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('horizon_min', sa.Integer(), nullable=False),
        sa.Column('trained_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('data_quality_summary', sa.JSON(), nullable=False),
        sa.Column('params', sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # 6. forecasts (append-only)
    op.create_table(
        'forecasts',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('symbol', sa.String(length=20), nullable=False),
        sa.Column('horizon_min', sa.Integer(), nullable=False),
        sa.Column('generated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('target_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('input_interval', sa.String(length=10), nullable=False, server_default='5m'),
        sa.Column('point_estimate', sa.Float(), nullable=False),
        sa.Column('low_50', sa.Float(), nullable=False),
        sa.Column('high_50', sa.Float(), nullable=False),
        sa.Column('low_90', sa.Float(), nullable=False),
        sa.Column('high_90', sa.Float(), nullable=False),
        sa.Column('model_version_id', sa.String(length=36), nullable=False),
        sa.Column('data_ts', sa.DateTime(timezone=True), nullable=False),
        sa.Column('freshness', sa.String(length=20), nullable=False, server_default='demo'),
        sa.Column('mode', sa.String(length=20), nullable=False, server_default='demo'),
        sa.ForeignKeyConstraint(['model_version_id'], ['model_versions.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_forecasts_symbol'), 'forecasts', ['symbol'], unique=False)
    op.create_index('ix_forecasts_symbol_generated_at', 'forecasts', ['symbol', 'generated_at'], unique=False)

    # 7. outcomes
    op.create_table(
        'outcomes',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('forecast_id', sa.String(length=36), nullable=False),
        sa.Column('actual_price', sa.Float(), nullable=True),
        sa.Column('abs_error', sa.Float(), nullable=True),
        sa.Column('within_range', sa.Boolean(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['forecast_id'], ['forecasts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('forecast_id'),
    )

    # 8. fold_results
    op.create_table(
        'fold_results',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('model_version_id', sa.String(length=36), nullable=False),
        sa.Column('fold', sa.Integer(), nullable=False),
        sa.Column('train_window', sa.JSON(), nullable=False),
        sa.Column('test_window', sa.JSON(), nullable=False),
        sa.Column('mae', sa.Float(), nullable=False),
        sa.Column('rmse', sa.Float(), nullable=False),
        sa.Column('directional_acc', sa.Float(), nullable=False),
        sa.Column('relative_mae', sa.Float(), nullable=False),
        sa.Column('coverage', sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(['model_version_id'], ['model_versions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('fold_results')
    op.drop_table('outcomes')
    op.drop_index('ix_forecasts_symbol_generated_at', table_name='forecasts')
    op.drop_index(op.f('ix_forecasts_symbol'), table_name='forecasts')
    op.drop_table('forecasts')
    op.drop_table('model_versions')
    op.drop_index('ix_candles_symbol_interval_ts', table_name='candles')
    op.drop_index(op.f('ix_candles_symbol'), table_name='candles')
    op.drop_table('candles')
    op.drop_index(op.f('ix_instruments_symbol'), table_name='instruments')
    op.drop_table('instruments')
    op.drop_index(op.f('ix_watchlist_items_user_id'), table_name='watchlist_items')
    op.drop_table('watchlist_items')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
