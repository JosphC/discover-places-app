import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryAPI, updateCategoryAPI, deleteCategoryAPI } from "../api/categories";
import { useAuthStore } from "@/stores/auth-store";

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { formData: { name: string; description?: string; color?: string } }) =>
      createCategoryAPI({ ...data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { categoryId: number; formData: { name?: string; description?: string; color?: string } }) =>
      updateCategoryAPI({ ...data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (data: { categoryId: number }) =>
      deleteCategoryAPI({ categoryId: data.categoryId, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
