import { Tag as TagType } from "@/types/types";
import { Tag } from "lucide-react";
import { EditDialog } from "./edit-dialog";
import { DeleteDialog } from "./delete-dialog";

interface IProps {
  tag: TagType;
  showActions?: boolean;
}

export const TagBadge = ({ tag, showActions = false }: IProps) => {
  return (
    <div className="flex items-center border px-3 py-2 bg-background rounded-md gap-2">
      <div className="flex items-center">
        <Tag className="size-4 mr-2" />
        <p className="text-xs font-medium">{tag.name}</p>
      </div>
      {showActions && (
        <div className="flex items-center gap-1 ml-2">
          <EditDialog tag={tag} />
          <DeleteDialog tagId={tag.id} />
        </div>
      )}
    </div>
  );
};
