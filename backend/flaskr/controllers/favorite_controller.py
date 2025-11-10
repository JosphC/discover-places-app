from flask_jwt_extended import get_jwt_identity
from flask_smorest import abort
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from flaskr.db import db
from flaskr.models.favorite_model import FavoriteModel
from flaskr.models.post_model import PostModel
from flaskr.schemas.plain_schema import PlainFavoriteSchema, PlainPostSchema


class FavoriteController:
    @staticmethod
    def get_all_by_user():
        """Get all favorites for the current user"""
        try:
            user_id = get_jwt_identity()
            favorite_schema = PlainFavoriteSchema()
            post_schema = PlainPostSchema()

            favorites = db.session.execute(
                select(FavoriteModel)
                .where(FavoriteModel.user_id == user_id)
                .join(PostModel, FavoriteModel.post_id == PostModel.id)
                .order_by(FavoriteModel.created_at.desc())
            ).unique().scalars().all()

            result = []
            for fav in favorites:
                fav_dict = {
                    **favorite_schema.dump(fav),
                    "post": {
                        **post_schema.dump(fav.post),
                        "status": fav.post.status.value,
                        "tagName": fav.post.tag.name if fav.post.tag else None,
                        "username": fav.post.user.username,
                        "userId": fav.post.user_id
                    }
                }
                result.append(fav_dict)

            return result
        except SQLAlchemyError:
            abort(500, message="Error fetching favorites")

    @staticmethod
    def get_by_post(post_id):
        """Check if current user has favorited a specific post"""
        try:
            user_id = get_jwt_identity()
            favorite_schema = PlainFavoriteSchema()

            favorite = db.session.execute(
                select(FavoriteModel).where(
                    (FavoriteModel.user_id == user_id) &
                    (FavoriteModel.post_id == post_id)
                )
            ).scalar_one_or_none()

            if not favorite:
                return {"favorited": False}

            return {
                "favorited": True,
                **favorite_schema.dump(favorite)
            }
        except SQLAlchemyError:
            abort(500, message="Error checking favorite")

    @staticmethod
    def create(data):
        """Add a post to favorites"""
        try:
            user_id = get_jwt_identity()
            favorite_schema = PlainFavoriteSchema()

            # Validate post exists
            post = db.session.execute(
                select(PostModel).where(PostModel.id == data["post_id"])
            ).unique().scalar_one_or_none()

            if not post:
                abort(404, message="Post not found")

            # Create favorite
            new_favorite = FavoriteModel(
                user_id=user_id,
                post_id=data["post_id"],
                notes=data.get("notes")
            )

            db.session.add(new_favorite)
            db.session.commit()

            return favorite_schema.dump(new_favorite)
        except IntegrityError:
            db.session.rollback()
            abort(400, message="Post already in favorites")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Error adding to favorites")

    @staticmethod
    def update(favorite_id, data):
        """Update favorite notes (only by the owner)"""
        try:
            user_id = get_jwt_identity()
            favorite_schema = PlainFavoriteSchema()

            favorite = db.session.execute(
                select(FavoriteModel).where(
                    (FavoriteModel.id == favorite_id) &
                    (FavoriteModel.user_id == user_id)
                )
            ).scalar_one_or_none()

            if not favorite:
                abort(404, message="Favorite not found or you don't have permission")

            # Update notes
            if "notes" in data:
                favorite.notes = data["notes"]

            db.session.commit()

            return favorite_schema.dump(favorite)
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Error updating favorite")

    @staticmethod
    def delete(favorite_id):
        """Remove from favorites (only by the owner)"""
        try:
            user_id = get_jwt_identity()

            favorite = db.session.execute(
                select(FavoriteModel).where(
                    (FavoriteModel.id == favorite_id) &
                    (FavoriteModel.user_id == user_id)
                )
            ).scalar_one_or_none()

            if not favorite:
                abort(404, message="Favorite not found or you don't have permission")

            db.session.delete(favorite)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Error removing favorite")

    @staticmethod
    def delete_by_post(post_id):
        """Remove a post from favorites by post_id (for convenience)"""
        try:
            user_id = get_jwt_identity()

            favorite = db.session.execute(
                select(FavoriteModel).where(
                    (FavoriteModel.user_id == user_id) &
                    (FavoriteModel.post_id == post_id)
                )
            ).scalar_one_or_none()

            if not favorite:
                abort(404, message="Favorite not found")

            db.session.delete(favorite)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Error removing favorite")
