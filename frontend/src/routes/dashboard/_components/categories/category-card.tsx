import { Category } from "@/types/types";
import { EditDialog } from "./edit-dialog";
import { DeleteDialog } from "./delete-dialog";
import { Pencil, Trash2 } from "lucide-react";

interface IProps {
  category: Category;
}

export const CategoryCard = ({ category }: IProps) => {
  return (
    <div className="border rounded-lg p-4 bg-background hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h3 className="font-semibold text-lg">{category.name}</h3>
        </div>
        <div className="flex gap-1">
          <EditDialog category={category} />
          <DeleteDialog categoryId={category.id} />
        </div>
      </div>
      {category.description && (
        <p className="text-sm text-muted-foreground mt-2">
          {category.description}
        </p>
      )}
      <div className="text-xs text-muted-foreground mt-3">
        Created: {new Date(category.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
