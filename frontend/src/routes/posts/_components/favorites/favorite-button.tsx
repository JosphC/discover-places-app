import { Button } from "@/components/ui/button";
import { useCheckIfPostIsFavoritedQuery } from "@/services/queries/favorites";
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteByPostMutation,
} from "@/services/mutations/favorites";
import { useAuthStore } from "@/stores/auth-store";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  postId: number;
  variant?: "default" | "icon";
}

export const FavoriteButton = ({ postId, variant = "default" }: Props) => {
  const token = useAuthStore((s) => s.token);
  const { data, isLoading } = useCheckIfPostIsFavoritedQuery(postId);
  const { mutate: createFavorite, isPending: isCreating } =
    useCreateFavoriteMutation();
  const { mutate: deleteFavorite, isPending: isDeleting } =
    useDeleteFavoriteByPostMutation();

  const isFavorited = data && "id" in data;
  const isPending = isCreating || isDeleting;

  const handleToggleFavorite = () => {
    if (isFavorited) {
      deleteFavorite(
        { postId, token },
        {
          onSuccess: () => {
            toast.success("Removed from favorites");
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data.message || "Failed to remove from favorites"
            );
          },
        }
      );
    } else {
      createFavorite(
        { postId, token },
        {
          onSuccess: () => {
            toast.success("Added to favorites");
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data.message || "Failed to add to favorites"
            );
          },
        }
      );
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleFavorite}
        disabled={isLoading || isPending}
        className="h-8 w-8"
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors",
            isFavorited
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      onClick={handleToggleFavorite}
      disabled={isLoading || isPending}
      className={cn(
        "gap-2",
        isFavorited && "bg-red-500 hover:bg-red-600"
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4",
          isFavorited && "fill-white"
        )}
      />
      {isFavorited ? "Favorited" : "Add to Favorites"}
    </Button>
  );
};
