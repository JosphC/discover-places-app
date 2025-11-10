from flask_jwt_extended import get_jwt_identity
from flask_smorest import abort
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound, SQLAlchemyError
from flaskr.db import db
from flaskr.models.user_model import UserModel
from flaskr.utils import generate_password


class UserController:
    @staticmethod
    def get_all():
        try:
            return db.session.execute(select(UserModel)).scalars().all()
        except SQLAlchemyError:
            abort(500, message="Internal server error while fetching users")

    @staticmethod
    def get_by_id(user_id):
        try:
            return db.session.execute(
                select(UserModel).where(UserModel.id == user_id)
            ).scalar_one()
        except NoResultFound:
            abort(404, message="User not found")
        except SQLAlchemyError:
            abort(500, message="Internal server error while fetching user")

    @staticmethod
    def create(data):
        try:
            user_registered = db.session.execute(
                select(UserModel).where(
                    (UserModel.username == data["username"])
                    | (UserModel.email == data["email"])
                )
            ).scalar_one_or_none()

            if user_registered:
                if user_registered.username == data["username"]:
                    abort(409, message="Username already registered")
                if user_registered.email == data["email"]:
                    abort(409, message="Email already registered")

            new_user = UserModel(**data)

            new_user.password = generate_password(data["password"])

            db.session.add(new_user)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error creating user: {str(e)}")  # Debug logging
            abort(500, message=f"Internal server error while creating user: {str(e)}")

    @staticmethod
    def get_current_user():
        try:
            user_id = get_jwt_identity()

            user = db.session.execute(
                select(UserModel).where(UserModel.id == user_id)
            ).scalar_one()

            return user
        except NoResultFound:
            abort(404, message="User not found")
        except SQLAlchemyError:
            abort(500, message="Internal server error while fetching current user")

    @staticmethod
    def update(data):
        try:
            user_id = get_jwt_identity()

            user = db.session.execute(
                select(UserModel).where(UserModel.id == user_id)
            ).scalar_one()

            # Check if username is being changed and if it's already taken
            if "username" in data and data["username"] != user.username:
                existing_user = db.session.execute(
                    select(UserModel).where(
                        UserModel.username == data["username"],
                        UserModel.id != user_id
                    )
                ).scalar_one_or_none()

                if existing_user:
                    abort(409, message="Username already taken")

                user.username = data["username"]

            # Check if email is being changed and if it's already taken
            if "email" in data and data["email"] != user.email:
                existing_user = db.session.execute(
                    select(UserModel).where(
                        UserModel.email == data["email"],
                        UserModel.id != user_id
                    )
                ).scalar_one_or_none()

                if existing_user:
                    abort(409, message="Email already taken")

                user.email = data["email"]

            # Update password if provided
            if "password" in data and data["password"]:
                user.password = generate_password(data["password"])

            db.session.commit()
            return {"message": "User updated successfully"}
        except NoResultFound:
            abort(404, message="User not found")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while updating user")

    @staticmethod
    def delete():
        try:
            user_id = get_jwt_identity()

            user = db.session.execute(
                select(UserModel).where(UserModel.id == user_id)
            ).scalar_one()

            db.session.delete(user)
            db.session.commit()
        except NoResultFound:
            abort(404, message="User not found")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="Internal server error while deleting user")
