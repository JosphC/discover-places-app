from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flaskr.controllers.tag_controller import TagController
from flaskr.schemas.schema import TagSchema, UpdateTagSchema
from flask_jwt_extended import jwt_required

bp = Blueprint("tags", __name__)


@bp.route("/tags")
class Tags(MethodView):
    @bp.response(200, TagSchema(many=True))
    def get(self):
        return TagController.get_all()

    @jwt_required()
    @bp.arguments(TagSchema)
    @bp.response(201)
    def post(self, data):
        return TagController.create(data)


@bp.route("/tags/bulk-delete")
class TagsBulkDelete(MethodView):
    @jwt_required()
    @bp.response(200)
    def post(self):
        """Protected route (JWT Required) - Delete multiple tags"""
        try:
            data = request.get_json()
            tag_ids = data.get("tag_ids", [])

            if not tag_ids:
                abort(400, message="No tag IDs provided")

            return TagController.delete_multiple(tag_ids)
        except Exception as e:
            abort(500, message=str(e))


@bp.route("/tags/<tag_id>")
class TagById(MethodView):
    @jwt_required()
    @bp.arguments(UpdateTagSchema)
    @bp.response(200)
    def put(self, data, tag_id):
        """Protected route (JWT Required) - Update a tag"""
        return TagController.update(data, tag_id)

    @jwt_required()
    @bp.response(204)
    def delete(self, tag_id):
        """Protected route (JWT Required) - Delete a tag"""
        return TagController.delete(tag_id)
