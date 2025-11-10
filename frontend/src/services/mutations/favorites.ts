import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFavoriteAPI,
  deleteFavoriteAPI,
  deleteFavoriteByPostAPI,
  updateFavoriteAPI
} from "../api/favorites";

export const useCreateFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavoriteAPI,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites", "post", variables.postId] });
    },
  });
};

export const useUpdateFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFavoriteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useDeleteFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavoriteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useDeleteFavoriteByPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavoriteByPostAPI,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites", "post", variables.postId] });
    },
  });
};
