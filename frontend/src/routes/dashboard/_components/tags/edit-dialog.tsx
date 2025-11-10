import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { EditForm } from "./edit-form";
import { Tag } from "@/types/types";
import { useState } from "react";

interface IProps {
  tag: Tag;
}

export const EditDialog = ({ tag }: IProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogDescription>
            Update the tag name. This will affect all tasks and posts using this tag.
          </DialogDescription>
        </DialogHeader>
        <EditForm tag={tag} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
