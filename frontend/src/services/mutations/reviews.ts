import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewAPI, deleteReviewAPI, updateReviewAPI } from "../api/reviews";

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewAPI,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "post", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReviewAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReviewAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
