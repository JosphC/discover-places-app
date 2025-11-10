from enum import Enum
from sqlalchemy import ForeignKey, String, Float, Enum as SaEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flaskr.db import db
from datetime import datetime, timezone
from typing import Optional


class PostStatus(Enum):
    NATURA = "NATURA"
    URBAN = "URBAN"
    RURAL = "RURAL"


class PostModel(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    content: Mapped[str] = mapped_column(String(1000), nullable=False)
    status: Mapped[PostStatus] = mapped_column(
        SaEnum(PostStatus), nullable=False, default=PostStatus.NATURA
    )
    image: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        index=True, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user = relationship("UserModel", back_populates="posts")

    # One-to-many relationship with tags (single tag per post)
    tag_id: Mapped[Optional[int]] = mapped_column(ForeignKey("tags.id", ondelete="SET NULL"), nullable=True)
    tag = relationship("TagModel", back_populates="posts")

    # Cascade delete relationships
    reviews = relationship("ReviewModel", back_populates="post", cascade="all, delete-orphan")
    favorites = relationship("FavoriteModel", back_populates="post", cascade="all, delete-orphan")
