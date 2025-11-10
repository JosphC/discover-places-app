from flask_jwt_extended import get_jwt_identity
from flask_smorest import abort
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound, SQLAlchemyError
from flaskr.db import db
from flaskr.models.category_model import CategoryModel


class CategoryController:
    @staticmethod
    def get_all():
        """Get all categories"""
        try:
            return db.session.execute(
                select(CategoryModel).order_by(CategoryModel.created_at.desc())
            ).scalars().all()
        except SQLAlchemyError:
            abort(500, message="Internal server error while fetching categories")

    @staticmethod
    def get_by_id(category_id):
        """Get a single category by ID"""
        try:
            category = db.session.execute(
                select(CategoryModel).where(CategoryModel.id == category_id)
            ).scalar_one()
            return category
        except NoResultFound:
            abort(404, message="Category not found")
        except SQLAlchemyError:
            abort(500, message="Internal server error while fetching category")

    @staticmethod
    def create(data):
        """Create a new category"""
        try:
            # Check if category name already exists
            existing_category = db.session.execute(
                select(CategoryModel).where(CategoryModel.name == data["name"])
            ).scalar_one_or_none()

            if existing_category:
                abort(409, message="Category with this name already exists")

            # Validate required fields
            if not data.get("name") or not data["name"].strip():
                abort(400, message="Category name is required and cannot be empty")

            if len(data["name"]) > 50:
                abort(400, message="Category name must be 50 characters or less")

            if data.get("description") and len(data["description"]) > 200:
                abort(400, message="Description must be 200 characters or less")

            # Validate color format (hex color)
            if "color" in data and data["color"]:
                if not data["color"].startswith("#") or len(data["color"]) != 7:
                    abort(400, message="Color must be a valid hex color code (e.g., #3B82F6)")

            new_category = CategoryModel(**data)

            db.session.add(new_category)
            db.session.commit()

            return {"message": "Category created successfully", "id": new_category.id}
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while creating category")

    @staticmethod
    def update(data, category_id):
        """Update an existing category"""
        try:
            category = db.session.execute(
                select(CategoryModel).where(CategoryModel.id == category_id)
            ).scalar_one()

            # Check if new name conflicts with existing category
            if "name" in data and data["name"] != category.name:
                existing_category = db.session.execute(
                    select(CategoryModel).where(
                        CategoryModel.name == data["name"],
                        CategoryModel.id != category_id
                    )
                ).scalar_one_or_none()

                if existing_category:
                    abort(409, message="Category with this name already exists")

            # Validate fields
            if "name" in data:
                if not data["name"] or not data["name"].strip():
                    abort(400, message="Category name cannot be empty")
                if len(data["name"]) > 50:
                    abort(400, message="Category name must be 50 characters or less")
                category.name = data["name"]

            if "description" in data:
                if data["description"] and len(data["description"]) > 200:
                    abort(400, message="Description must be 200 characters or less")
                category.description = data["description"]

            if "color" in data and data["color"]:
                if not data["color"].startswith("#") or len(data["color"]) != 7:
                    abort(400, message="Color must be a valid hex color code (e.g., #3B82F6)")
                category.color = data["color"]

            db.session.commit()
            return {"message": "Category updated successfully"}
        except NoResultFound:
            abort(404, message="Category not found")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while updating category")

    @staticmethod
    def delete(category_id):
        """Delete a category"""
        try:
            category = db.session.execute(
                select(CategoryModel).where(CategoryModel.id == category_id)
            ).scalar_one()

            db.session.delete(category)
            db.session.commit()
        except NoResultFound:
            abort(404, message="Category not found")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while deleting category")
