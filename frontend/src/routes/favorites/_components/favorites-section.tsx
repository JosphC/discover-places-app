import { useGetAllFavoritesQuery } from "@/services/queries/favorites";
import { FavoriteCard } from "./favorite-card";
import { useSEO } from "@/hooks/useSEO";
import { LoaderCircle, Heart } from "lucide-react";

export const FavoritesSection = () => {
  useSEO("My Favorites | Spotly");

  const { data: favorites, isLoading, error } = useGetAllFavoritesQuery();

  if (isLoading) {
    return (
      <div className="cs-container py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="w-8 h-8 fill-red-500 text-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-1">
              Your saved places to visit later
            </p>
          </div>
        </div>
        <div className="flex justify-center py-20">
          <LoaderCircle className="w-12 h-12 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cs-container py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="w-8 h-8 fill-red-500 text-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-1">
              Your saved places to visit later
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500">Error loading favorites. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-container py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            My Favorites
          </h1>
          <p className="text-muted-foreground mt-1">
            Your saved places to visit later
          </p>
        </div>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-muted-foreground text-lg mb-2">
            No favorites yet
          </p>
          <p className="text-sm text-muted-foreground">
            Start exploring and add places to your favorites!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.map((favorite) => (
            <FavoriteCard key={favorite.id} favorite={favorite} />
          ))}
        </div>
      )}
    </div>
  );
};
