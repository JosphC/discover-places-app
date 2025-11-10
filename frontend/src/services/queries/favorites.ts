import { useQuery } from "@tanstack/react-query";
import { getAllFavoritesAPI, checkIfPostIsFavoritedAPI } from "../api/favorites";

export const useGetAllFavoritesQuery = () => {
  return useQuery({
    queryKey: ["favorites", "all"],
    queryFn: getAllFavoritesAPI,
  });
};

export const useCheckIfPostIsFavoritedQuery = (postId: number) => {
  return useQuery({
    queryKey: ["favorites", "post", postId],
    queryFn: () => checkIfPostIsFavoritedAPI(postId),
    enabled: !!postId,
  });
};
