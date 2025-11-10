import { Task } from "@/types/types";
import { Tag } from "@/types/types";
import { TagBadge } from "../tags/tag-badge";
import { StatusBadge } from "./status-badge";
import { ShowDialog } from "./show-dialog";

interface IProps {
  task: Task;
}

export const TaskCard = ({ task }: IProps) => {
  // Create a tag object for the TagBadge component
  const tag: Tag = {
    id: 0, // We don't have tag ID in task object
    name: task.tagName,
  };

  return (
    <div className="border rounded-md p-4 bg-background">
      <div className="pb-2 flex items-center">
        <ShowDialog task={task} />
      </div>
      <div className="flex items-center gap-x-1">
        <TagBadge tag={tag} showActions={false} />
        <StatusBadge status={task.status} />
      </div>
    </div>
  );
};
