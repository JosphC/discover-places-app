from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint
from flask.views import MethodView
from flaskr.controllers.category_controller import CategoryController
from flaskr.schemas.schema import CategorySchema, UpdateCategorySchema

bp = Blueprint("categories", __name__)


@bp.route("/categories")
class Categories(MethodView):
    @bp.response(200, CategorySchema(many=True))
    def get(self):
        """Get all categories"""
        return CategoryController.get_all()

    @jwt_required()
    @bp.arguments(CategorySchema)
    @bp.response(201)
    def post(self, data):
        """Protected route (JWT Required) - Create a new category"""
        return CategoryController.create(data)


@bp.route("/categories/<category_id>")
class CategoryById(MethodView):
    @bp.response(200, CategorySchema)
    def get(self, category_id):
        """Get a single category by ID"""
        return CategoryController.get_by_id(category_id)

    @jwt_required()
    @bp.arguments(UpdateCategorySchema)
    @bp.response(200)
    def put(self, data, category_id):
        """Protected route (JWT Required) - Update a category"""
        return CategoryController.update(data, category_id)

    @jwt_required()
    @bp.response(204)
    def delete(self, category_id):
        """Protected route (JWT Required) - Delete a category"""
        return CategoryController.delete(category_id)
