"""create categories table

Revision ID: create_categories_001
Revises:
Create Date: 2024-10-27

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'create_categories_001'
down_revision = None
depends_on = None


def upgrade():
    op.create_table('categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=200), nullable=True),
        sa.Column('color', sa.String(length=7), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_created_at'), 'categories', ['created_at'], unique=False)
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=True)


def downgrade():
    op.drop_index(op.f('ix_categories_name'), table_name='categories')
    op.drop_index(op.f('ix_categories_created_at'), table_name='categories')
    op.drop_table('categories')
