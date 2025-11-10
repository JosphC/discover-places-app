import {
  createCommentAPI,
  deleteCommentAPI,
  getTaskCommentsAPI,
  updateCommentAPI,
} from "@/services/api/comments";
import { TCommentSchema } from "@/schemas/comment-schema";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTaskCommentsQuery = (taskId: number) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getTaskCommentsAPI(taskId),
  });
};

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { formData: TCommentSchema; taskId: number }) =>
      createCommentAPI({ ...data, token }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });
    },
  });
};

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { commentId: number; formData: TCommentSchema; taskId: number }) =>
      updateCommentAPI({ commentId: data.commentId, formData: data.formData, token }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { commentId: number; taskId: number }) =>
      deleteCommentAPI({ commentId: data.commentId, token }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });
    },
  });
};
