import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { useGetAllReviewsByPostQuery } from "@/services/queries/reviews";
import { useDeleteReviewMutation } from "@/services/mutations/reviews";
import { useAuthStore } from "@/stores/auth-store";
import { formatDistanceToNow } from "date-fns";
import { Trash2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditReviewDialog } from "./edit-review-dialog";

interface Props {
  postId: number;
}

export const ReviewsList = ({ postId }: Props) => {
  const userId = useAuthStore((s) => s.userId);
  const token = useAuthStore((s) => s.token);
  const { data, isLoading } = useGetAllReviewsByPostQuery(postId);
  const { mutate: deleteReview } = useDeleteReviewMutation();

  const handleDelete = (reviewId: number) => {
    deleteReview(
      { reviewId, token },
      {
        onSuccess: () => {
          toast.success("Review deleted successfully");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data.message || "Failed to delete review"
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoaderCircle className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data || data.reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          <StarRating rating={data.averageRating} readonly size="lg" showNumber />
        </div>
        <span className="text-sm text-gray-600">
          ({data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"})
        </span>
      </div>

      <div className="space-y-3">
        {data.reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{review.username}</span>
                    <StarRating rating={review.rating} readonly size="sm" />
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                {review.userId === userId && (
                  <div className="flex gap-1">
                    <EditReviewDialog review={review} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this review? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(review.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
