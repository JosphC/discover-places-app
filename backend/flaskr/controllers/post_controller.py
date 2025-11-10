from flask_jwt_extended import get_jwt_identity
from flask_smorest import abort
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import NoResultFound, SQLAlchemyError
from flaskr.db import db
from flaskr.models.post_model import PostModel
from flaskr.models.user_model import UserModel
from flaskr.models.tag_model import TagModel


class PostController:
    @staticmethod
    def get_all():
        """Get all posts from all users"""
        try:
            posts = db.session.execute(
                select(PostModel)
                .join(UserModel, PostModel.user_id == UserModel.id)
                .outerjoin(TagModel, PostModel.tag_id == TagModel.id)
                .options(joinedload(PostModel.user), joinedload(PostModel.tag))
                .order_by(PostModel.created_at.desc())
            ).unique().scalars().all()

            result = []
            for post in posts:
                tag_name = post.tag.name if post.tag else None
                post_dict = {
                    "id": post.id,
                    "title": post.title,
                    "content": post.content,
                    "status": post.status.value,
                    "image": post.image,
                    "latitude": post.latitude,
                    "longitude": post.longitude,
                    "createdAt": post.created_at.isoformat() if post.created_at else None,
                    "updatedAt": post.updated_at.isoformat() if post.updated_at else None,
                    "userId": post.user_id,
                    "username": post.user.username,
                    "tagName": tag_name
                }
                print(f"Post ID {post.id}: tagName = {tag_name}, tag_id = {post.tag_id}")
                result.append(post_dict)

            return result
        except SQLAlchemyError as e:
            print(f"Error in get_all: {str(e)}")
            abort(500, message="Internal server error while fetching all posts")

    @staticmethod
    def get_all_on_user():
        """Get posts for the current authenticated user"""
        try:
            user_id = get_jwt_identity()

            posts = db.session.execute(
                select(PostModel)
                .where(PostModel.user_id == user_id)
                .join(UserModel, PostModel.user_id == UserModel.id)
                .outerjoin(TagModel, PostModel.tag_id == TagModel.id)
                .options(joinedload(PostModel.user), joinedload(PostModel.tag))
                .order_by(PostModel.created_at.desc())
            ).unique().scalars().all()

            result = []
            for post in posts:
                tag_name = post.tag.name if post.tag else None
                post_dict = {
                    "id": post.id,
                    "title": post.title,
                    "content": post.content,
                    "status": post.status.value,
                    "image": post.image,
                    "latitude": post.latitude,
                    "longitude": post.longitude,
                    "createdAt": post.created_at.isoformat() if post.created_at else None,
                    "updatedAt": post.updated_at.isoformat() if post.updated_at else None,
                    "userId": post.user_id,
                    "username": post.user.username,
                    "tagName": tag_name
                }
                print(f"User Post ID {post.id}: tagName = {tag_name}, tag_id = {post.tag_id}")
                result.append(post_dict)

            return result
        except SQLAlchemyError as e:
            print(f"Error in get_all_on_user: {str(e)}")
            abort(500, message="Internal server error while fetching user posts")

    @staticmethod
    def create(data):
        try:
            user_id = get_jwt_identity()

            tag_id = data.get("tag_id")
            print(f"Creating post with tag_id: {tag_id}")
            print(f"Full data: {data}")

            # Create post with single tag
            new_post = PostModel(
                user_id=user_id,
                title=data["title"],
                content=data["content"],
                status=data["status"],
                image=data.get("image"),
                latitude=data.get("latitude"),
                longitude=data.get("longitude"),
                tag_id=tag_id
            )

            db.session.add(new_post)
            db.session.commit()
            db.session.refresh(new_post)

            print(f"Post created successfully: ID={new_post.id}, tag_id={new_post.tag_id}")
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error creating post: {str(e)}")
            abort(500, message=f"Error: {str(e)}")

    @staticmethod
    def update(data, post_id):
        try:
            user_id = get_jwt_identity()
            post = db.session.execute(
                select(PostModel).where(
                    (PostModel.id == post_id) & (PostModel.user_id == user_id)
                )
            ).scalar_one_or_none()
            if not post:
                abort(404, message="Post not found")

            post.title = data["title"]
            post.content = data["content"]
            post.status = data["status"]

            # Handle single tag
            if "tag_id" in data:
                post.tag_id = data["tag_id"]

            if "image" in data:
                post.image = data["image"]
            if "latitude" in data:
                post.latitude = data["latitude"]
            if "longitude" in data:
                post.longitude = data["longitude"]

            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Error updating post")

    @staticmethod
    def delete(post_id):
        try:
            user_id = get_jwt_identity()
            post = db.session.execute(
                select(PostModel).where(
                    (PostModel.id == post_id) & (PostModel.user_id == user_id)
                )
            ).scalar_one_or_none()
            if not post:
                abort(404, message="Post not found")
            db.session.delete(post)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error deleting post: {str(e)}")  # Debug logging
            abort(500, message=f"Error deleting post: {str(e)}")
