import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useDeletePostMutation } from "@/services/mutations/posts";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

type DeletePostDialogProps = {
  postId: number;
};

export const DeletePostDialog = ({ postId }: DeletePostDialogProps) => {
  const [open, setOpen] = useState(false);
  const { token } = useAuthStore();
  const deletePostMutation = useDeletePostMutation();

  const handleDelete = async () => {
    try {
      await deletePostMutation.mutateAsync({
        postId,
        token,
      });
      toast.success("Place deleted successfully!");
      setOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to delete post. Please try again.";
      toast.error(errorMessage);
      console.error("Delete post error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Place</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this place? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePostMutation.isPending}
          >
            {deletePostMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
