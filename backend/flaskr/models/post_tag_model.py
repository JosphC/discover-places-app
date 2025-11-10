from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from flaskr.db import db


class PostTagModel(db.Model):
    """Association table for many-to-many relationship between posts and tags"""
    __tablename__ = "post_tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    tag_id: Mapped[int] = mapped_column(ForeignKey("tags.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('post_id', 'tag_id', name='unique_post_tag'),
    )
