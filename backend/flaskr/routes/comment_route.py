from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint
from flask.views import MethodView
from flaskr.controllers.comment_controller import CommentController
from flaskr.schemas.schema import CommentSchema, UpdateCommentSchema

bp = Blueprint("comments", __name__)


@bp.route("/tasks/<task_id>/comments")
class Comments(MethodView):
    @bp.response(200, CommentSchema(many=True))
    def get(self, task_id):
        """Get all comments for a specific task"""
        return CommentController.get_task_comments(task_id)

    @jwt_required()
    @bp.arguments(CommentSchema)
    @bp.response(201)
    def post(self, data, task_id):
        """Protected route (JWT Required)"""
        data["task_id"] = task_id
        return CommentController.create(data)


@bp.route("/comments/<comment_id>")
class CommentById(MethodView):
    @jwt_required()
    @bp.arguments(UpdateCommentSchema)
    @bp.response(200)
    def put(self, data, comment_id):
        """Protected route (JWT Required) - Update a comment"""
        return CommentController.update(data, comment_id)

    @jwt_required()
    @bp.response(204)
    def delete(self, comment_id):
        """Protected route (JWT Required)"""
        return CommentController.delete(comment_id)