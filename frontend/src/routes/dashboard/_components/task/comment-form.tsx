import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { CommentSchema, TCommentSchema } from "@/schemas/comment-schema";
import { useCreateCommentMutation } from "@/services/queries/comments";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  taskId: number;
}

export const CommentForm = ({ taskId }: Props) => {
  const { mutate: createComment, isLoading } = useCreateCommentMutation();

  const form = useForm<TCommentSchema>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (formData: TCommentSchema) => {
    createComment(
      { formData, taskId },
      {
        onSuccess: () => {
          toast.success("Comment added successfully");
          reset();
        },
        onError: (error: any) => {
          toast.error(error.response?.data.message || "Failed to add comment");
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form className="grid gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write a comment..."
                  disabled={isSubmitting}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Add Comment"
          )}
        </Button>
      </form>
    </Form>
  );
};
