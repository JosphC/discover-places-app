import { useAuthStore } from "@/stores/auth-store";
import { Post } from "@/types/types";
import { ENV } from "@/config/env";
import axios from "axios";

export type TCreatePostFormSchema = {
  title: string;
  content: string;
};

export type TEditPostFormSchema = {
  title: string;
  content: string;
};

export const getAllPostsAPI = async () => {
  const token = useAuthStore.getState().token;

  const response = await axios.get<Post[]>(
    `${ENV.API_URL}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log("API Response - All Posts:", response.data);
  console.log("First post tagName:", response.data[0]?.tagName);

  return response.data;
};

export const getPostsOnUserAPI = async () => {
  const token = useAuthStore.getState().token;

  const response = await axios.get<Post[]>(
    `${ENV.API_URL}/posts/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log("API Response - User Posts:", response.data);
  console.log("First user post tagName:", response.data[0]?.tagName);

  return response.data;
};

export const createPostAPI = async (data: {
  formData: FormData;
  token: string | null;
}) => {
  const { formData, token } = data;

  await axios.post(`${ENV.API_URL}/posts`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePostAPI = async (data: {
  formData: FormData;
  postId: number;
  token: string | null;
}) => {
  const { formData, token, postId } = data;

  await axios.put(`${ENV.API_URL}/posts/${postId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePostAPI = async (data: {
  postId: number;
  token: string | null;
}) => {
  const { token, postId } = data;

  await axios.delete(`${ENV.API_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
