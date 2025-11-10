import { useState } from "react";
import { useGetTagsQuery } from "@/services/queries/tags";
import { useBulkDeleteTagsMutation } from "@/services/mutations/tags";
import { Tag } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Tag as TagIcon } from "lucide-react";
import { toast } from "sonner";
import { EditDialog } from "./edit-dialog";
import { DeleteDialog } from "./delete-dialog";
import { CreateTagDialog } from "./create-tag-dialog";
import { LoadingState } from "./loading-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

export const TagsManagement = () => {
  const { data: tags = [], isLoading } = useGetTagsQuery();
  const bulkDeleteMutation = useBulkDeleteTagsMutation();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const toggleTagSelection = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const selectAll = () => {
    if (selectedTags.length === tags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(tags.map(tag => tag.id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync({ tagIds: selectedTags });
      toast.success(`Successfully deleted ${selectedTags.length} tag(s)`);
      setSelectedTags([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete tags");
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Tags Management</h2>
          {tags.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({selectedTags.length}/{tags.length} selected)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedTags.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4 mr-1" />
                  Delete Selected ({selectedTags.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Multiple Tags?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedTags.length} tag(s)?
                    This action cannot be undone and will remove these tags from all associated tasks and posts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={handleBulkDelete}
                  >
                    Delete {selectedTags.length} Tag(s)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <CreateTagDialog />
        </div>
      </div>

      {/* Tags list */}
      {tags.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <TagIcon className="size-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No tags yet. Create your first one!</p>
          <CreateTagDialog />
        </div>
      ) : (
        <div className="space-y-2">
          {/* Select all checkbox */}
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/20">
            <Checkbox
              checked={selectedTags.length === tags.length && tags.length > 0}
              onCheckedChange={selectAll}
            />
            <span className="text-sm font-medium">Select All</span>
          </div>

          {/* Tag items */}
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  selectedTags.includes(tag.id) ? "bg-accent border-accent-foreground/20" : "bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTagSelection(tag.id)}
                  />
                  <div className="flex items-center gap-2">
                    <TagIcon className="size-4 text-muted-foreground" />
                    <span className="font-medium">{tag.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <EditDialog tag={tag} />
                  <DeleteDialog tagId={tag.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
