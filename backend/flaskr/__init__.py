import flaskr.models
import os

from flask import Flask, send_from_directory
from config import DevelopmentConfig
from flaskr.extensions import migrate, api, cors, jwt
from flaskr.db import db

from flaskr.routes.auth_route import bp as auth_route
from flaskr.routes.user_route import bp as user_route
from flaskr.routes.tag_route import bp as tag_route
from flaskr.routes.task_route import bp as task_route
from flaskr.routes.post_route import bp as post_route
from flaskr.routes.comment_route import bp as comment_route
from flaskr.routes.category_route import bp as category_route
from flaskr.routes.review_route import bp as review_route
from flaskr.routes.favorite_route import bp as favorite_route


def create_app(test_config=None):
    app = Flask(__name__)

    if test_config is None:
        app.config.from_object(DevelopmentConfig)
    else:
        app.config.from_object(test_config)

    # Create uploads directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    cors.init_app(app)
    jwt.init_app(app)

    api.register_blueprint(auth_route, url_prefix="/api/v1")
    api.register_blueprint(user_route, url_prefix="/api/v1")
    api.register_blueprint(tag_route, url_prefix="/api/v1")
    api.register_blueprint(task_route, url_prefix="/api/v1")
    api.register_blueprint(post_route, url_prefix="/api/v1")
    api.register_blueprint(comment_route, url_prefix="/api/v1")
    api.register_blueprint(category_route, url_prefix="/api/v1")
    api.register_blueprint(review_route, url_prefix="/api/v1")
    api.register_blueprint(favorite_route, url_prefix="/api/v1")

    # Route to serve uploaded images
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app
