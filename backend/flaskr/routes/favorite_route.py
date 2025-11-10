from flask import request
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint
from flask.views import MethodView
from flaskr.controllers.favorite_controller import FavoriteController
from flaskr.schemas.schema import FavoriteSchema, UpdateFavoriteSchema

bp = Blueprint("favorites", __name__)


@bp.route("/favorites")
class Favorites(MethodView):
    @jwt_required()
    def get(self):
        """Get all favorites for the current user"""
        return FavoriteController.get_all_by_user()

    @jwt_required()
    @bp.arguments(FavoriteSchema)
    @bp.response(201, FavoriteSchema)
    def post(self, favorite_data):
        """Add a post to favorites"""
        return FavoriteController.create(favorite_data)


@bp.route("/favorites/<int:favorite_id>")
class FavoriteById(MethodView):
    @jwt_required()
    @bp.arguments(UpdateFavoriteSchema)
    @bp.response(200, FavoriteSchema)
    def put(self, favorite_data, favorite_id):
        """Update favorite notes"""
        return FavoriteController.update(favorite_id, favorite_data)

    @jwt_required()
    @bp.response(204)
    def delete(self, favorite_id):
        """Remove from favorites"""
        return FavoriteController.delete(favorite_id)


@bp.route("/posts/<int:post_id>/favorite")
class FavoriteByPost(MethodView):
    @jwt_required()
    def get(self, post_id):
        """Check if post is favorited by current user"""
        result = FavoriteController.get_by_post(post_id)
        if result:
            return result
        return {"favorited": False}, 200

    @jwt_required()
    @bp.response(204)
    def delete(self, post_id):
        """Remove post from favorites by post_id"""
        return FavoriteController.delete_by_post(post_id)
