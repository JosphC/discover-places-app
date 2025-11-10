import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTagAPI, updateTagAPI, deleteTagAPI, bulkDeleteTagsAPI } from "../api/tags";
import { useAuthStore } from "@/stores/auth-store";

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { formData: { name: string } }) =>
      createTagAPI({ ...data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useUpdateTagMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { tagId: number; formData: { name: string } }) =>
      updateTagAPI({ ...data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { tagId: number }) =>
      deleteTagAPI({ tagId: data.tagId, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useBulkDeleteTagsMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { tagIds: number[] }) =>
      bulkDeleteTagsAPI({ tagIds: data.tagIds, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
