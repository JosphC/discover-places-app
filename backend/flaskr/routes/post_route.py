from flask import request, current_app
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint, abort
from flask.views import MethodView
from werkzeug.utils import secure_filename
from flaskr.controllers.post_controller import PostController
from flaskr.schemas.schema import PostSchema, UpdatePostSchema
import os
import uuid

bp = Blueprint("posts", __name__)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


def validate_image_file(file):
    """Validate image file size and type"""
    if not file or not file.filename:
        return None, None

    if not allowed_file(file.filename):
        abort(400, message="Invalid file type. Allowed types: png, jpg, jpeg, gif, webp")

    # Check file size (read first to validate, then save)
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size > current_app.config['MAX_CONTENT_LENGTH']:
        abort(400, message="File size exceeds 16MB limit")

    if file_size == 0:
        abort(400, message="File is empty")

    return file, file_size


@bp.route("/posts")
class Posts(MethodView):
    @jwt_required()
    @bp.response(200, PostSchema(many=True))
    def get(self):
        """Protected route (JWT Required) - Get all posts from all users"""
        return PostController.get_all()

    @jwt_required()
    def post(self):
        """Protected route (JWT Required) - Create a new post with file upload"""
        try:
            # Get form data
            data = {
                'title': request.form.get('title'),
                'content': request.form.get('content'),
                'status': request.form.get('status'),
                'tag_id': int(request.form.get('tagId')) if request.form.get('tagId') else None,
            }

            # Handle optional latitude and longitude
            if request.form.get('latitude'):
                try:
                    data['latitude'] = float(request.form.get('latitude'))
                except (ValueError, TypeError):
                    pass

            if request.form.get('longitude'):
                try:
                    data['longitude'] = float(request.form.get('longitude'))
                except (ValueError, TypeError):
                    pass

            # Handle file upload with validation
            if 'image' in request.files:
                file = request.files['image']
                validated_file, _ = validate_image_file(file)

                if validated_file:
                    # Ensure upload directory exists
                    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)

                    # Generate unique filename
                    ext = validated_file.filename.rsplit('.', 1)[1].lower()
                    filename = f"{uuid.uuid4()}.{ext}"
                    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

                    # Save file
                    validated_file.save(filepath)
                    data['image'] = filename

            PostController.create(data)
            return {"message": "Post created successfully"}, 201
        except Exception as e:
            abort(500, message=f"Error creating post: {str(e)}")


@bp.route("/posts/user")
class PostsOnUser(MethodView):
    @jwt_required()
    @bp.response(200, PostSchema(many=True))
    def get(self):
        """Protected route (JWT Required) - Get posts for current user only"""
        return PostController.get_all_on_user()


@bp.route("/posts/<post_id>")
class PostById(MethodView):
    @jwt_required()
    def put(self, post_id):
        """Protected route (JWT Required) - Update a post (only your own)"""
        try:
            # Get form data
            data = {
                'title': request.form.get('title'),
                'content': request.form.get('content'),
                'status': request.form.get('status'),
            }

            # Handle single tag
            if request.form.get('tagId'):
                data['tag_id'] = int(request.form.get('tagId'))

            # Handle optional latitude and longitude
            if request.form.get('latitude'):
                try:
                    data['latitude'] = float(request.form.get('latitude'))
                except (ValueError, TypeError):
                    pass

            if request.form.get('longitude'):
                try:
                    data['longitude'] = float(request.form.get('longitude'))
                except (ValueError, TypeError):
                    pass

            # Handle file upload with validation
            if 'image' in request.files:
                file = request.files['image']
                validated_file, _ = validate_image_file(file)

                if validated_file:
                    # Ensure upload directory exists
                    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)

                    # Generate unique filename
                    ext = validated_file.filename.rsplit('.', 1)[1].lower()
                    filename = f"{uuid.uuid4()}.{ext}"
                    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

                    # Save file
                    validated_file.save(filepath)
                    data['image'] = filename

            PostController.update(data, post_id)
            return {"message": "Post updated successfully"}, 200
        except Exception as e:
            abort(500, message=f"Error updating post: {str(e)}")

    @jwt_required()
    @bp.response(204)
    def delete(self, post_id):
        """Protected route (JWT Required) - Delete a post (only your own)"""
        return PostController.delete(post_id)
