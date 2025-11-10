import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCategoryMutation } from "@/services/mutations/categories";
import { Category } from "@/types/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  category: Category;
  onClose: () => void;
}

interface FormData {
  name: string;
  description?: string;
  color: string;
}

export const EditForm = ({ category, onClose }: IProps) => {
  const mutation = useUpdateCategoryMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: category.name,
      description: category.description || "",
      color: category.color,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        categoryId: category.id,
        formData: data,
      });
      toast.success("Category updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update category");
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
          {mutation.isPending ? "Updating..." : "Update Category"}
        </Button>
      </div>
    </form>
  );
};
