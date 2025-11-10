import { Post } from "@/types/types";
import { ENV } from "@/config/env";
import { formatDistanceToNow } from "date-fns";
import { EditPostDialog } from "./edit-post-dialog";
import { DeletePostDialog } from "./delete-post-dialog";
import { ShowPostDialog } from "./show-post-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type PostCardProps = {
  post: Post;
  showActions?: boolean;
};

export const PostCard = ({ post, showActions = false }: PostCardProps) => {
  // Safely parse date with fallback
  let timeAgo = "recently";
  try {
    const date = new Date(post.createdAt);
    if (!isNaN(date.getTime())) {
      timeAgo = formatDistanceToNow(date, { addSuffix: true });
    }
  } catch (error) {
    console.error("Error parsing date:", post.createdAt, error);
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                {post.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{post.username}</p>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
              </div>
            </div>
            <h2 className="text-xl font-bold mt-2 line-clamp-2">{post.title}</h2>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <EditPostDialog post={post} />
              <DeletePostDialog postId={post.id} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {post.image && (
          <div className="mb-4 overflow-hidden rounded-lg group">
            <img
              src={`${ENV.UPLOADS_URL}/${post.image}`}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            {post.status.replace('PostStatus.', '')}
          </span>
          {post.tagName && (
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
              #{post.tagName}
            </span>
          )}
        </div>
        <p className="text-muted-foreground whitespace-pre-wrap line-clamp-3 mb-4 leading-relaxed">
          {post.content}
        </p>
        <ShowPostDialog post={post} />
      </CardContent>
    </Card>
  );
};
