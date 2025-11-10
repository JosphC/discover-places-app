import { Favorite } from "@/types/types";
import { ENV } from "@/config/env";
import { formatDistanceToNow } from "date-fns";
import { ShowPostDialog } from "@/routes/posts/_components/show-post-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeleteFavoriteMutation } from "@/services/mutations/favorites";
import { useAuthStore } from "@/stores/auth-store";
import { Heart } from "lucide-react";
import { toast } from "sonner";
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

type FavoriteCardProps = {
  favorite: Favorite;
};

export const FavoriteCard = ({ favorite }: FavoriteCardProps) => {
  const token = useAuthStore((s) => s.token);
  const { mutate: deleteFavorite } = useDeleteFavoriteMutation();

  const timeAgo = formatDistanceToNow(new Date(favorite.createdAt), {
    addSuffix: true,
  });

  const handleDelete = () => {
    deleteFavorite(
      { favoriteId: favorite.id, token },
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
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                {favorite.post.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{favorite.post.username}</p>
                <p className="text-xs text-muted-foreground">Saved {timeAgo}</p>
              </div>
            </div>
            <h2 className="text-xl font-bold mt-2 line-clamp-2">
              {favorite.post.title}
            </h2>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove from Favorites</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this place from your favorites?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        {favorite.post.image && (
          <div className="mb-4 overflow-hidden rounded-lg group">
            <img
              src={`${ENV.UPLOADS_URL}/${favorite.post.image}`}
              alt={favorite.post.title}
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            {favorite.post.status.replace("PostStatus.", "")}
          </span>
          {favorite.post.tagName && (
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
              #{favorite.post.tagName}
            </span>
          )}
        </div>
        {favorite.notes && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">Your Notes:</p>
            <p className="text-sm text-yellow-700">{favorite.notes}</p>
          </div>
        )}
        <p className="text-muted-foreground whitespace-pre-wrap line-clamp-3 mb-4 leading-relaxed">
          {favorite.post.content}
        </p>
        <ShowPostDialog post={favorite.post} />
      </CardContent>
    </Card>
  );
};
