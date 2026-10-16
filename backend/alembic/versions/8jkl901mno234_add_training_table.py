"""add training table

Revision ID: 8jkl901mno234
Revises: ghi789jkl012
Create Date: 2026-10-15 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8jkl901mno234'
down_revision = 'ghi789jkl012'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create training_programmes table
    op.create_table(
        'training_programmes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('course_or_skill_area', sa.String(length=255), nullable=False),
        sa.Column('training_provider', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('status', sa.Enum('draft', 'active', 'completed', 'cancelled', name='trainingstatus'), nullable=False),
        sa.Column('institute_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['institute_id'], ['institutes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_training_programmes_id'), 'training_programmes', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_training_programmes_id'), table_name='training_programmes')
    op.drop_table('training_programmes')
    # Drop the enum type
    op.execute("DROP TYPE trainingstatus")
