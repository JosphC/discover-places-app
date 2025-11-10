import { Button } from "@/components/ui/button";
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
import { useCreateReviewMutation } from "@/services/mutations/reviews";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  postId: number;
  onSuccess?: () => void;
}

export const ReviewForm = ({ postId, onSuccess }: Props) => {
  const token = useAuthStore((s) => s.token);
  const { mutate: createReview, isPending } = useCreateReviewMutation();

  const form = useForm<TReviewSchema>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (formData: TReviewSchema) => {
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    createReview(
      {
        postId,
        rating: formData.rating,
        comment: formData.comment,
        token,
      },
      {
        onSuccess: () => {
          toast.success("Review added successfully");
          reset();
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data.message || "Failed to add review"
          );
        },
      }
    );
  };

  return (
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

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || isSubmitting}
        >
          {isPending || isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </Form>
  );
};
