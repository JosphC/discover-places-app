import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateForm } from "./create-form";
import { useState } from "react";

export const CreateDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-medium">
          Create Task
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
          <DialogDescription>
            Add a new task to keep track of your work and stay organized.
          </DialogDescription>
        </DialogHeader>
        <CreateForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
