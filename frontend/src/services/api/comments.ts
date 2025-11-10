import { TCommentSchema } from "@/schemas/comment-schema";
import { useAuthStore } from "@/stores/auth-store";
import { Comment } from "@/types/types";
import axios from "axios";

export const getTaskCommentsAPI = async (taskId: number) => {
  const response = await axios.get<Comment[]>(
    `http://localhost:5000/api/v1/tasks/${taskId}/comments`
  );

  return response.data;
};

export const createCommentAPI = async (data: {
  formData: TCommentSchema;
  taskId: number;
  token: string | null;
}) => {
  const { formData, taskId, token } = data;

  await axios.post(
    `http://localhost:5000/api/v1/tasks/${taskId}/comments`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateCommentAPI = async (data: {
  commentId: number;
  formData: TCommentSchema;
  token: string | null;
}) => {
  const { commentId, formData, token } = data;

  await axios.put(
    `http://localhost:5000/api/v1/comments/${commentId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteCommentAPI = async (data: {
  commentId: number;
  token: string | null;
}) => {
  const { commentId, token } = data;

  await axios.delete(`http://localhost:5000/api/v1/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
