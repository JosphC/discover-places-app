import {
  useDeleteCommentMutation,
  useGetTaskCommentsQuery,
} from "@/services/queries/comments";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  taskId: number;
}

export const CommentsList = ({ taskId }: Props) => {
  const { data: comments, isLoading } = useGetTaskCommentsQuery(taskId);
  const { mutate: deleteComment } = useDeleteCommentMutation();
  const userId = useAuthStore((state) => state.userId);

  const handleDelete = (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment(
        { commentId, taskId },
        {
          onSuccess: () => {
            toast.success("Comment deleted successfully");
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data.message || "Failed to delete comment"
            );
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
    );
  }

  if (!comments?.length) {
    return <p className="text-muted-foreground text-sm">No comments yet</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="pt-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{comment.username}</p>
                <p className="text-muted-foreground text-sm">
                  {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              {comment.userId === userId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-destructive hover:opacity-80"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <p className="mt-2">{comment.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
