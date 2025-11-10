from flaskr import create_app
from flaskr.models.tag_model import TagModel
from flaskr.models.post_model import PostModel
from flaskr.db import db

app = create_app()

with app.app_context():
    print("=== ALL TAGS IN DATABASE ===")
    tags = TagModel.query.all()
    for tag in tags:
        print(f"Tag ID: {tag.id}, Name: {tag.name}")

    print("\n=== ALL POSTS WITH THEIR TAGS ===")
    posts = PostModel.query.all()
    for post in posts:
        tag_name = post.tag.name if post.tag else "NO TAG"
        print(f"Post ID: {post.id}, Title: {post.title}, tag_id: {post.tag_id}, Tag Name: {tag_name}")
