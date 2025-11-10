from application import create_app
from flaskr.db import db
from flaskr.models.tag_model import TagModel

app = create_app()

with app.app_context():
    # Check if tags already exist
    existing_tags = TagModel.query.all()

    if len(existing_tags) == 0:
        # Create default tags
        default_tags = [
            TagModel(name="Mountain"),
            TagModel(name="Beach"),
            TagModel(name="City"),
            TagModel(name="Forest"),
            TagModel(name="Desert"),
            TagModel(name="Lake"),
            TagModel(name="River"),
            TagModel(name="Park"),
        ]

        for tag in default_tags:
            db.session.add(tag)

        db.session.commit()
        print(f"Created {len(default_tags)} default tags successfully!")
    else:
        print(f"Tags already exist ({len(existing_tags)} tags found). Skipping...")
