import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task, Tag } from "@/types/types";
import { TagBadge } from "../tags/tag-badge";
import { StatusBadge } from "./status-badge";
import { CommentForm } from "./comment-form";
import { CommentsList } from "./comments-list";

interface IProps {
  task: Task;
}
export const ShowDialog = ({ task }: IProps) => {
  // Create a tag object for the TagBadge component
  const tag: Tag = {
    id: 0,
    name: task.tagName,
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <h3 className="font-semibold line-clamp-1 text-sm md:cursor-pointer md:hover:underline">
          {task.title}
        </h3>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <div>
            <DialogTitle className="text-base mb-2">{task.title}</DialogTitle>
            <div className="flex items-center gap-x-1">
              <TagBadge tag={tag} showActions={false} />
              <StatusBadge status={task.status} />
            </div>
          </div>
          <DialogDescription>{task.content}</DialogDescription>
        </DialogHeader>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Comments</h4>
          <div className="space-y-4">
            <CommentForm taskId={task.id} />
            <CommentsList taskId={task.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
