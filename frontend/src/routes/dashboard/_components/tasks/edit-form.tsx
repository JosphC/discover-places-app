import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTaskMutation } from "@/services/mutations/tasks";
import { useAuthStore } from "@/stores/auth-store";
import { EditFormSchema, TEditFormSchema } from "@/schemas/task-schema";
import { Task } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  task: Task;
  onClose: () => void;
}

export const EditForm = ({ task, onClose }: IProps) => {
  const mutation = useUpdateTaskMutation();
  const { token } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TEditFormSchema>({
    resolver: zodResolver(EditFormSchema),
    defaultValues: {
      title: task.title,
      content: task.content,
      status: task.status,
    },
  });

  const onSubmit = async (data: TEditFormSchema) => {
    try {
      await mutation.mutateAsync({ formData: data, taskId: task.id, token });
      toast.success("Task updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Task title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Task description"
          rows={4}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          defaultValue={task.status}
          onValueChange={(value) => setValue("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NATURA">NATURA</SelectItem>
            <SelectItem value="URBAN">URBAN</SelectItem>
            <SelectItem value="RURAL">RURAL</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Task"}
        </Button>
      </div>
    </form>
  );
};
