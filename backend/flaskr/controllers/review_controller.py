from flask_jwt_extended import get_jwt_identity
from flask_smorest import abort
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from flaskr.db import db
from flaskr.models.review_model import ReviewModel
from flaskr.models.user_model import UserModel
from flaskr.models.post_model import PostModel
from flaskr.schemas.plain_schema import PlainReviewSchema


class ReviewController:
    @staticmethod
    def get_all_by_post(post_id):
        """Get all reviews for a specific post with average rating"""
        try:
            schema = PlainReviewSchema()

            # Get reviews
            reviews = db.session.execute(
                select(ReviewModel)
                .where(ReviewModel.post_id == post_id)
                .join(UserModel, ReviewModel.user_id == UserModel.id)
                .order_by(ReviewModel.created_at.desc())
            ).scalars().all()

            # Calculate average rating
            avg_rating = db.session.execute(
                select(func.avg(ReviewModel.rating))
                .where(ReviewModel.post_id == post_id)
            ).scalar()

            result = {
                "reviews": [
                    {
                        **schema.dump(review),
                        "username": review.user.username,
                    }
                    for review in reviews
                ],
                "averageRating": round(avg_rating, 1) if avg_rating else 0,
                "totalReviews": len(reviews)
            }

            return result
        except SQLAlchemyError:
            abort(500, message="Error fetching reviews")

    @staticmethod
    def get_by_id(review_id):
        """Get a specific review"""
        try:
            review = db.session.execute(
                select(ReviewModel).where(ReviewModel.id == review_id)
            ).scalar_one_or_none()

            if not review:
                abort(404, message="Review not found")

            return {
                "id": review.id,
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at,
                "updated_at": review.updated_at,
                "user_id": review.user_id,
                "username": review.user.username,
                "post_id": review.post_id
            }
        except SQLAlchemyError:
            abort(500, message="Error fetching review")

    @staticmethod
    def create(data):
        """Create a new review"""
        try:
            user_id = get_jwt_identity()

            # Validate post exists
            post = db.session.execute(
                select(PostModel).where(PostModel.id == data["post_id"])
            ).unique().scalar_one_or_none()

            if not post:
                abort(404, message="Post not found")

            # Create review
            new_review = ReviewModel(
                user_id=user_id,
                post_id=data["post_id"],
                rating=data["rating"],
                comment=data["comment"]
            )

            db.session.add(new_review)
            db.session.commit()

            return {
                "id": new_review.id,
                "rating": new_review.rating,
                "comment": new_review.comment,
                "created_at": new_review.created_at,
                "user_id": new_review.user_id,
                "post_id": new_review.post_id
            }
        except IntegrityError:
            db.session.rollback()
            abort(400, message="You have already reviewed this post")
        except SQLAlchemyError as e:
            db.session.rollback()
            abort(500, message=f"Error creating review: {str(e)}")

    @staticmethod
    def update(review_id, data):
        """Update a review (only by the owner)"""
        try:
            user_id = get_jwt_identity()

            review = db.session.execute(
                select(ReviewModel).where(
                    (ReviewModel.id == review_id) & (ReviewModel.user_id == user_id)
                )
            ).scalar_one_or_none()

            if not review:
                abort(404, message="Review not found or you don't have permission")

            # Update fields
            if "rating" in data:
                review.rating = data["rating"]
            if "comment" in data:
                review.comment = data["comment"]

            db.session.commit()

            return {
                "id": review.id,
                "rating": review.rating,
                "comment": review.comment,
                "updated_at": review.updated_at,
                "user_id": review.user_id,
                "post_id": review.post_id
            }
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Error updating review")

    @staticmethod
    def delete(review_id):
        """Delete a review (only by the owner)"""
        try:
            user_id = get_jwt_identity()

            review = db.session.execute(
                select(ReviewModel).where(
                    (ReviewModel.id == review_id) & (ReviewModel.user_id == user_id)
                )
            ).scalar_one_or_none()

            if not review:
                abort(404, message="Review not found or you don't have permission")

            db.session.delete(review)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Error deleting review")
