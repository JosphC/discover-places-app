import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewSchema, TReviewSchema } from "@/schemas/review-schema";
import { useUpdateReviewMutation } from "@/services/mutations/reviews";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Review } from "@/types/types";

interface Props {
  review: Review;
}

export const EditReviewDialog = ({ review }: Props) => {
  const [open, setOpen] = useState(false);
  const token = useAuthStore((s) => s.token);
  const { mutate: updateReview, isPending } = useUpdateReviewMutation();

  const form = useForm<TReviewSchema>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: review.rating,
      comment: review.comment,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (formData: TReviewSchema) => {
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    updateReview(
      {
        reviewId: review.id,
        rating: formData.rating,
        comment: formData.comment,
        token,
      },
      {
        onSuccess: () => {
          toast.success("Review updated successfully");
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data.message || "Failed to update review"
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="w-4 h-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      size="lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your experience at this place..."
                      disabled={isSubmitting}
                      className="resize-none min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isSubmitting}
              >
                {isPending || isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Update Review"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
