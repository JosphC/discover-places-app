import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateCommentMutation } from "@/services/queries/comments";
import { Comment } from "@/types/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  comment: Comment;
  taskId: number;
}

interface FormData {
  content: string;
}

export const EditCommentDialog = ({ comment, taskId }: IProps) => {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateCommentMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      content: comment.content,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        commentId: comment.id,
        formData: data,
        taskId,
      });
      toast.success("Comment updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data.message || "Failed to update comment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:opacity-80">
          <Pencil size={18} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
          <DialogDescription>
            Make changes to your comment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Comment</Label>
            <Textarea
              id="content"
              {...register("content", {
                required: "Comment is required",
                minLength: {
                  value: 1,
                  message: "Comment must not be empty"
                }
              })}
              placeholder="Edit your comment..."
              rows={4}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update Comment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
