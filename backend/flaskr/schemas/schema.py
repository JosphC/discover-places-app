from marshmallow import fields
from flaskr.schemas.plain_schema import (
    PlainSignInSchema,
    PlainTagSchema,
    PlainTaskSchema,
    PlainUserSchema,
    PlainPostSchema,
    PlainCommentSchema,
    PlainCategorySchema,
    PlainReviewSchema,
    PlainFavoriteSchema,
)


class UserSchema(PlainUserSchema):
    pass


class UpdateUserSchema(PlainUserSchema):
    username = fields.Str(required=False)
    email = fields.Email(required=False)
    password = fields.Str(required=False, load_only=True)


class SignInSchema(PlainSignInSchema):
    pass


class TagSchema(PlainTagSchema):
    pass


class UpdateTagSchema(PlainTagSchema):
    pass


class TaskSchema(PlainTaskSchema):
    tag_name = fields.Str(dump_only=True, data_key="tagName")
    tag_id = fields.Int(required=True, load_only=True, data_key="tagId")


class UpdateTaskSchema(PlainTaskSchema):
    tag_id = fields.Int(required=False, load_only=True, data_key="tagId")


class CommentSchema(PlainCommentSchema):
    pass


class UpdateCommentSchema(PlainCommentSchema):
    task_id = fields.Int(required=False, load_only=True, data_key="taskId")


class PostSchema(PlainPostSchema):
    user_id = fields.Int(dump_only=True, data_key="userId")
    username = fields.Str(dump_only=True)
    tag_name = fields.Str(dump_only=True, allow_none=True, data_key="tagName")
    tag_id = fields.Int(required=True, load_only=True, data_key="tagId")


class UpdatePostSchema(PlainPostSchema):
    tag_id = fields.Int(required=False, load_only=True, data_key="tagId")


class CategorySchema(PlainCategorySchema):
    pass


class UpdateCategorySchema(PlainCategorySchema):
    name = fields.Str(required=False)
    description = fields.Str(required=False, allow_none=True)
    color = fields.Str(required=False)


class ReviewSchema(PlainReviewSchema):
    post_id = fields.Int(required=False, load_only=True, data_key="postId")


class UpdateReviewSchema(PlainReviewSchema):
    rating = fields.Int(required=False)
    comment = fields.Str(required=False)
    post_id = fields.Int(required=False, load_only=True, data_key="postId")


class FavoriteSchema(PlainFavoriteSchema):
    post_id = fields.Int(required=True, load_only=True, data_key="postId")


class UpdateFavoriteSchema(PlainFavoriteSchema):
    notes = fields.Str(required=False, allow_none=True)
    post_id = fields.Int(required=False, load_only=True, data_key="postId")
