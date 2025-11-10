from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flaskr.db import db
from datetime import datetime, timezone
from typing import Optional


class FavoriteModel(db.Model):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(primary_key=True)
    notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        index=True, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Foreign keys
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    user = relationship("UserModel", backref="favorites")
    post = relationship("PostModel", back_populates="favorites")

    # Constraints - one favorite per user per post
    __table_args__ = (
        db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_favorite'),
    )
