import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI, getCategoryByIdAPI } from "../api/categories";

export const useGetCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
  });
};

export const useGetCategoryByIdQuery = (categoryId: number) => {
  return useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => getCategoryByIdAPI(categoryId),
    enabled: !!categoryId,
  });
};
