"""merge migrations

Revision ID: f21aef0c04db
Revises: 7cf2dabb6b08, create_categories_001
Create Date: 2025-10-27 21:46:24.321778

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f21aef0c04db'
down_revision = ('7cf2dabb6b08', 'create_categories_001')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
