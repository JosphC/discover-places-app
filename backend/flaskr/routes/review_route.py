from flask import request
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint
from flask.views import MethodView
from flaskr.controllers.review_controller import ReviewController
from flaskr.schemas.schema import ReviewSchema, UpdateReviewSchema

bp = Blueprint("reviews", __name__)


@bp.route("/posts/<int:post_id>/reviews")
class ReviewsByPost(MethodView):
    @jwt_required()
    def get(self, post_id):
        """Get all reviews for a post"""
        return ReviewController.get_all_by_post(post_id)

    @jwt_required()
    @bp.arguments(ReviewSchema)
    @bp.response(201, ReviewSchema)
    def post(self, review_data, post_id):
        """Create a review for a post"""
        review_data["post_id"] = post_id
        return ReviewController.create(review_data)


@bp.route("/reviews/<int:review_id>")
class ReviewById(MethodView):
    @jwt_required()
    @bp.response(200, ReviewSchema)
    def get(self, review_id):
        """Get a specific review"""
        return ReviewController.get_by_id(review_id)

    @jwt_required()
    @bp.arguments(UpdateReviewSchema)
    @bp.response(200, ReviewSchema)
    def put(self, review_data, review_id):
        """Update a review"""
        return ReviewController.update(review_id, review_data)

    @jwt_required()
    @bp.response(204)
    def delete(self, review_id):
        """Delete a review"""
        return ReviewController.delete(review_id)
