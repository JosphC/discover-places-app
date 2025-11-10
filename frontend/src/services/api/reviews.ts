import { useAuthStore } from "@/stores/auth-store";
import { Review, ReviewsResponse } from "@/types/types";
import { ENV } from "@/config/env";
import axios from "axios";

export type TCreateReviewFormSchema = {
  rating: number;
  comment: string;
};

export type TEditReviewFormSchema = {
  rating: number;
  comment: string;
};

export const getAllReviewsByPostAPI = async (postId: number) => {
  const token = useAuthStore.getState().token;

  const response = await axios.get<ReviewsResponse>(
    `${ENV.API_URL}/posts/${postId}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getReviewByIdAPI = async (reviewId: number) => {
  const token = useAuthStore.getState().token;

  const response = await axios.get<Review>(
    `${ENV.API_URL}/reviews/${reviewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const createReviewAPI = async (data: {
  postId: number;
  rating: number;
  comment: string;
  token: string | null;
}) => {
  const { postId, rating, comment, token } = data;

  const response = await axios.post(
    `${ENV.API_URL}/posts/${postId}/reviews`,
    { rating, comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const updateReviewAPI = async (data: {
  reviewId: number;
  rating: number;
  comment: string;
  token: string | null;
}) => {
  const { reviewId, rating, comment, token } = data;

  const response = await axios.put(
    `${ENV.API_URL}/reviews/${reviewId}`,
    { rating, comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const deleteReviewAPI = async (data: {
  reviewId: number;
  token: string | null;
}) => {
  const { reviewId, token } = data;

  await axios.delete(`${ENV.API_URL}/reviews/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
