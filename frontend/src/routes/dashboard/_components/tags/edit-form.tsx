import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateTagMutation } from "@/services/mutations/tags";
import { Tag } from "@/types/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  tag: Tag;
  onClose: () => void;
}

interface FormData {
  name: string;
}

export const EditForm = ({ tag, onClose }: IProps) => {
  const mutation = useUpdateTagMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: tag.name,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        tagId: tag.id,
        formData: data,
      });
      toast.success("Tag successfully updated");
      onClose();
    } catch (error) {
      toast.error("Failed to update tag");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tag Name</Label>
        <Input
          id="name"
          {...register("name", {
            required: "Tag name is required",
            maxLength: {
              value: 20,
              message: "Tag name must be at most 20 characters"
            }
          })}
          placeholder="Enter tag name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Tag"}
        </Button>
      </div>
    </form>
  );
};
