import { useAuthStore } from "@/stores/auth-store";
import { Favorite } from "@/types/types";
import { ENV } from "@/config/env";
import axios from "axios";

export type TCreateFavoriteFormSchema = {
  postId: number;
  notes?: string;
};

export type TUpdateFavoriteFormSchema = {
  notes?: string;
};

export const getAllFavoritesAPI = async () => {
  const token = useAuthStore.getState().token;

  const response = await axios.get<Favorite[]>(
    `${ENV.API_URL}/favorites`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const checkIfPostIsFavoritedAPI = async (postId: number) => {
  const token = useAuthStore.getState().token;

  const response = await axios.get<{ favorited: boolean; id?: number; notes?: string; createdAt?: Date; postId?: number }>(
    `${ENV.API_URL}/posts/${postId}/favorite`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const createFavoriteAPI = async (data: {
  postId: number;
  notes?: string;
  token: string | null;
}) => {
  const { postId, notes, token } = data;

  const response = await axios.post(
    `${ENV.API_URL}/favorites`,
    { postId, notes },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const updateFavoriteAPI = async (data: {
  favoriteId: number;
  notes?: string;
  token: string | null;
}) => {
  const { favoriteId, notes, token } = data;

  const response = await axios.put(
    `${ENV.API_URL}/favorites/${favoriteId}`,
    { notes },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const deleteFavoriteAPI = async (data: {
  favoriteId: number;
  token: string | null;
}) => {
  const { favoriteId, token } = data;

  await axios.delete(`${ENV.API_URL}/favorites/${favoriteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFavoriteByPostAPI = async (data: {
  postId: number;
  token: string | null;
}) => {
  const { postId, token } = data;

  await axios.delete(`${ENV.API_URL}/posts/${postId}/favorite`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
