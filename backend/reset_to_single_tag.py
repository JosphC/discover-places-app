"""
Script to reset the database back to single tag for posts
Run this with: python reset_to_single_tag.py
"""
import os

# Delete database
db_path = "data.db"
if os.path.exists(db_path):
    os.remove(db_path)
    print(f"Deleted {db_path}")

# Delete migration that converts to many-to-many
migration_path = "migrations/versions/e8e4087529d6_convert_posts_tags_to_many_to_many_.py"
if os.path.exists(migration_path):
    os.remove(migration_path)
    print(f"Deleted {migration_path}")

print("\nNow run:")
print("1. flask db upgrade  # To recreate the database with single tag")
print("2. python seed_tags.py  # To add tags to the database")
print("3. flask run  # To start the server")
