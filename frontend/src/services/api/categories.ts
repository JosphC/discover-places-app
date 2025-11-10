import { Category } from "@/types/types";
import axios from "axios";

export const getCategoriesAPI = async () => {
  const response = await axios.get<Category[]>("http://localhost:5000/api/v1/categories");
  return response.data;
};

export const getCategoryByIdAPI = async (categoryId: number) => {
  const response = await axios.get<Category>(`http://localhost:5000/api/v1/categories/${categoryId}`);
  return response.data;
};

export const createCategoryAPI = async (data: {
  formData: { name: string; description?: string; color?: string };
  token: string | null;
}) => {
  const { formData, token } = data;

  await axios.post("http://localhost:5000/api/v1/categories", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCategoryAPI = async (data: {
  categoryId: number;
  formData: { name?: string; description?: string; color?: string };
  token: string | null;
}) => {
  const { categoryId, formData, token } = data;

  await axios.put(`http://localhost:5000/api/v1/categories/${categoryId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCategoryAPI = async (data: {
  categoryId: number;
  token: string | null;
}) => {
  const { categoryId, token } = data;

  await axios.delete(`http://localhost:5000/api/v1/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
