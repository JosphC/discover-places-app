from sqlalchemy import ForeignKey, String, Integer, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flaskr.db import db
from datetime import datetime, timezone


class ReviewModel(db.Model):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(String(500), nullable=False)
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
    user = relationship("UserModel", backref="reviews")
    post = relationship("PostModel", back_populates="reviews")

    # Constraints
    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
        # Ensure one review per user per post
        db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_review'),
    )
