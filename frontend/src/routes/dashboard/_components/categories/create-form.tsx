import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategoryMutation } from "@/services/mutations/categories";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  description?: string;
  color: string;
}

export const CreateForm = ({ onClose }: IProps) => {
  const mutation = useCreateCategoryMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      color: "#3B82F6",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({ formData: data });
      toast.success("Category created successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          {...register("name", {
            required: "Category name is required",
            maxLength: {
              value: 50,
              message: "Name must be 50 characters or less"
            }
          })}
          placeholder="Enter category name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register("description", {
            maxLength: {
              value: 200,
              message: "Description must be 200 characters or less"
            }
          })}
          placeholder="Enter category description"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            {...register("color", {
              required: "Color is required",
            })}
            className="w-20 h-10"
          />
          <Input
            {...register("color")}
            placeholder="#3B82F6"
            className="flex-1"
          />
        </div>
        {errors.color && (
          <p className="text-sm text-destructive">{errors.color.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Category"}
        </Button>
      </div>
    </form>
  );
};
