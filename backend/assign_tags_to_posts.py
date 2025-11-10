"""
Script to assign tags to all posts that don't have a tag
"""
from flaskr import create_app
from flaskr.models.post_model import PostModel
from flaskr.models.tag_model import TagModel
from flaskr.db import db
import random

app = create_app()

with app.app_context():
    # Get all tags
    all_tags = TagModel.query.all()

    if not all_tags:
        print("ERROR: No tags found in database!")
        print("Please create tags first before running this script.")
        exit(1)

    print(f"Found {len(all_tags)} tags:")
    for tag in all_tags:
        print(f"  - {tag.name} (ID: {tag.id})")

    # Get all posts without tags
    posts_without_tags = PostModel.query.filter(PostModel.tag_id == None).all()

    print(f"\nFound {len(posts_without_tags)} posts without tags")

    if len(posts_without_tags) == 0:
        print("All posts already have tags! Nothing to do.")
        exit(0)

    print("\nAssigning random tags to posts...")

    for post in posts_without_tags:
        # Assign a random tag
        random_tag = random.choice(all_tags)
        post.tag_id = random_tag.id
        print(f"  Post ID {post.id} ('{post.title}') -> Tag: {random_tag.name}")

    # Commit all changes
    db.session.commit()

    print(f"\n✅ Successfully assigned tags to {len(posts_without_tags)} posts!")

    # Verify
    remaining_without_tags = PostModel.query.filter(PostModel.tag_id == None).count()
    print(f"\nVerification: {remaining_without_tags} posts still without tags")

    if remaining_without_tags == 0:
        print("✅ All posts now have tags!")
