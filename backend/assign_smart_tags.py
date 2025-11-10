"""
Script to assign appropriate tags to posts based on their status
NATURA posts → Nature-related tags (River, Mountain, Beach, Forest, Lake)
URBAN posts → City-related tags (City, Street, Building, Park)
RURAL posts → Rural-related tags (Desert, Village, Farm, Countryside)
"""
from flaskr import create_app
from flaskr.models.post_model import PostModel, PostStatus
from flaskr.models.tag_model import TagModel
from flaskr.db import db
import random

app = create_app()

# Tag mapping based on post status
TAG_MAPPING = {
    PostStatus.NATURA: ["River", "Mountain", "Beach", "Forest", "Lake", "Ocean", "Waterfall"],
    PostStatus.URBAN: ["City", "Street", "Building", "Park", "Mall", "Square"],
    PostStatus.RURAL: ["Desert", "Village", "Farm", "Countryside", "Field", "Ranch"]
}

with app.app_context():
    print("=" * 60)
    print("SMART TAG ASSIGNMENT SCRIPT")
    print("=" * 60)

    # Get all tags
    all_tags = {tag.name: tag for tag in TagModel.query.all()}

    if not all_tags:
        print("\n❌ ERROR: No tags found in database!")
        print("Please create tags first before running this script.")
        exit(1)

    print(f"\n✓ Found {len(all_tags)} tags in database:")
    for tag_name in sorted(all_tags.keys()):
        print(f"  - {tag_name}")

    # Get all posts without tags
    posts_without_tags = PostModel.query.filter(PostModel.tag_id == None).all()

    print(f"\n✓ Found {len(posts_without_tags)} posts without tags")

    if len(posts_without_tags) == 0:
        print("\n✅ All posts already have tags! Nothing to do.")
        exit(0)

    print("\n" + "=" * 60)
    print("ASSIGNING TAGS...")
    print("=" * 60)

    assigned_count = 0
    skipped_count = 0

    for post in posts_without_tags:
        # Get appropriate tags for this post's status
        possible_tag_names = TAG_MAPPING.get(post.status, [])

        # Filter to only tags that exist in database
        available_tags = [name for name in possible_tag_names if name in all_tags]

        if available_tags:
            # Choose a random appropriate tag
            chosen_tag_name = random.choice(available_tags)
            chosen_tag = all_tags[chosen_tag_name]

            post.tag_id = chosen_tag.id
            assigned_count += 1

            status_display = post.status.name if hasattr(post.status, 'name') else str(post.status)
            print(f"✓ Post #{post.id} '{post.title[:30]}...' ({status_display}) → #{chosen_tag_name}")
        else:
            # Fallback: assign any random tag
            fallback_tag = random.choice(list(all_tags.values()))
            post.tag_id = fallback_tag.id
            skipped_count += 1

            status_display = post.status.name if hasattr(post.status, 'name') else str(post.status)
            print(f"⚠ Post #{post.id} '{post.title[:30]}...' ({status_display}) → #{fallback_tag.name} (fallback)")

    # Commit all changes
    db.session.commit()

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully assigned tags to {assigned_count} posts")
    if skipped_count > 0:
        print(f"⚠  {skipped_count} posts used fallback tags")

    # Final verification
    remaining_without_tags = PostModel.query.filter(PostModel.tag_id == None).count()
    total_posts = PostModel.query.count()
    posts_with_tags = total_posts - remaining_without_tags

    print(f"\n📊 Final Status:")
    print(f"   Total posts: {total_posts}")
    print(f"   Posts with tags: {posts_with_tags}")
    print(f"   Posts without tags: {remaining_without_tags}")

    if remaining_without_tags == 0:
        print("\n🎉 SUCCESS! All posts now have tags!")
    else:
        print(f"\n⚠  Warning: {remaining_without_tags} posts still without tags")
