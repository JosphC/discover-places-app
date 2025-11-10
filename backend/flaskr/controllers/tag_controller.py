from flask_smorest import abort
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError, NoResultFound
from flaskr.db import db
from flaskr.models.tag_model import TagModel


class TagController:
    @staticmethod
    def get_all():
        try:
            return db.session.execute(select(TagModel).limit(15)).scalars().all()
        except SQLAlchemyError:
            abort(500, message="Internal server error while fetching tags")

    @staticmethod
    def create(data):
        try:
            tag_registered = db.session.execute(
                select(TagModel).where(TagModel.name == data["name"])
            ).scalar_one_or_none()

            if tag_registered:
                abort(409, message="Tag already registered")

            new_tag = TagModel(**data)

            db.session.add(new_tag)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while creating tag")

    @staticmethod
    def update(data, tag_id):
        try:
            tag = db.session.execute(
                select(TagModel).where(TagModel.id == tag_id)
            ).scalar_one()

            # Check if another tag with the same name exists
            if "name" in data:
                duplicate_tag = db.session.execute(
                    select(TagModel).where(
                        TagModel.name == data["name"],
                        TagModel.id != tag_id
                    )
                ).scalar_one_or_none()

                if duplicate_tag:
                    abort(409, message="Tag with this name already exists")

            # Update tag fields
            for key, value in data.items():
                setattr(tag, key, value)

            db.session.commit()
            return {"message": "Tag updated successfully"}
        except NoResultFound:
            abort(404, message="Tag not found")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while updating tag")

    @staticmethod
    def delete(tag_id):
        try:
            tag = db.session.execute(
                select(TagModel).where(TagModel.id == tag_id)
            ).scalar_one()

            db.session.delete(tag)
            db.session.commit()
        except NoResultFound:
            abort(404, message="Tag not found")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while deleting tag")

    @staticmethod
    def delete_multiple(tag_ids):
        """Delete multiple tags at once"""
        try:
            if not tag_ids or not isinstance(tag_ids, list):
                abort(400, message="Invalid tag IDs provided")

            # Get all tags with the provided IDs
            tags = db.session.execute(
                select(TagModel).where(TagModel.id.in_(tag_ids))
            ).scalars().all()

            if not tags:
                abort(404, message="No tags found with provided IDs")

            deleted_count = len(tags)

            # Delete all found tags
            for tag in tags:
                db.session.delete(tag)

            db.session.commit()
            return {"message": f"Successfully deleted {deleted_count} tag(s)", "deleted_count": deleted_count}
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while deleting tags")
