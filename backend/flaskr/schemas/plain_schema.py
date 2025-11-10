from marshmallow import Schema, fields, validate


class PlainUserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)


class PlainSignInSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True)


class PlainTagSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)


class PlainTaskSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    content = fields.Str(required=True)
    status = fields.Str(
        validate=validate.OneOf(["NATURA", "URBAN", "RURAL"]), required=True
    )
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")


class PlainPostSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    content = fields.Str(required=True)
    status = fields.Str(
        validate=validate.OneOf(["NATURA", "URBAN", "RURAL"]), required=True
    )
    image = fields.Str(required=False, allow_none=True)
    latitude = fields.Float(required=False, allow_none=True)
    longitude = fields.Float(required=False, allow_none=True)
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")


class PlainCommentSchema(Schema):
    id = fields.Int(dump_only=True)
    content = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    user_id = fields.Int(dump_only=True, data_key="userId")
    task_id = fields.Int(required=True, load_only=True, data_key="taskId")
    username = fields.Str(dump_only=True)


class PlainCategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(required=False, allow_none=True)
    color = fields.Str(required=False)
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")


class PlainReviewSchema(Schema):
    id = fields.Int(dump_only=True)
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.Str(required=True, validate=validate.Length(min=1, max=500))
    post_id = fields.Int(required=True, load_only=True, data_key="postId")
    user_id = fields.Int(dump_only=True, data_key="userId")
    username = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")


class PlainFavoriteSchema(Schema):
    id = fields.Int(dump_only=True)
    notes = fields.Str(required=False, allow_none=True, validate=validate.Length(max=500))
    post_id = fields.Int(required=True, load_only=True, data_key="postId")
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
