from flask_jwt_extended import get_jwt_identity
from flask_smorest import abort
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound, SQLAlchemyError
from flaskr.db import db
from flaskr.models.comment_model import CommentModel
from flaskr.models.user_model import UserModel


class CommentController:
    @staticmethod
    def get_task_comments(task_id):
        try:
            # Get comments with username for the task
            return (
                db.session.query(
                    CommentModel.id,
                    CommentModel.content,
                    CommentModel.created_at,
                    CommentModel.user_id,
                    UserModel.username,
                )
                .join(UserModel, CommentModel.user_id == UserModel.id)
                .filter(CommentModel.task_id == task_id)
                .order_by(CommentModel.created_at.desc())
                .all()
            )
        except SQLAlchemyError:
            abort(500, message="Internal server error while fetching task comments")

    @staticmethod
    def create(data):
        try:
            user_id = get_jwt_identity()

            comment_data = {
                "user_id": user_id,
                "content": data["content"],
                "task_id": data["task_id"]
            }

            new_comment = CommentModel(**comment_data)
            db.session.add(new_comment)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while creating comment")

    @staticmethod
    def update(data, comment_id):
        try:
            user_id = get_jwt_identity()
            comment = db.session.execute(
                select(CommentModel).where(CommentModel.id == comment_id)
            ).scalar_one()

            # Only allow comment update by the comment author
            if comment.user_id != int(user_id):
                abort(403, message="Not authorized to update this comment")

            # Update comment content
            if "content" in data:
                comment.content = data["content"]

            db.session.commit()
            return {"message": "Comment updated successfully"}
        except NoResultFound:
            abort(404, message="Comment not found")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while updating comment")

    @staticmethod
    def delete(comment_id):
        try:
            user_id = get_jwt_identity()
            comment = db.session.execute(
                select(CommentModel).where(CommentModel.id == comment_id)
            ).scalar_one()

            # Only allow comment deletion by the comment author
            if comment.user_id != int(user_id):
                abort(403, message="Not authorized to delete this comment")

            db.session.delete(comment)
            db.session.commit()
        except NoResultFound:
            abort(404, message="Comment not found")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while deleting comment")