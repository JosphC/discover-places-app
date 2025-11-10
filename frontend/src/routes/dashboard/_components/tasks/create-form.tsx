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
import { useCreateTaskMutation } from "@/services/mutations/tasks";
import { useGetTagsQuery } from "@/services/queries/tags";
import { useAuthStore } from "@/stores/auth-store";
import { CreateFormSchema, TCreateFormSchema } from "@/schemas/task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  onClose: () => void;
}

export const CreateForm = ({ onClose }: IProps) => {
  const mutation = useCreateTaskMutation();
  const { data: tags = [] } = useGetTagsQuery();
  const { token } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TCreateFormSchema>({
    resolver: zodResolver(CreateFormSchema),
  });

  const onSubmit = async (data: TCreateFormSchema) => {
    try {
      await mutation.mutateAsync({ formData: data, token });
      toast.success("Task created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create task");
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
        <Select onValueChange={(value) => setValue("status", value)}>
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

      <div className="space-y-2">
        <Label htmlFor="tagId">Tag</Label>
        <Select onValueChange={(value) => setValue("tagId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id.toString()}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tagId && (
          <p className="text-sm text-destructive">{errors.tagId.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  );
};
