import { Tag } from "@/types/types";
import axios from "axios";

export const getTagsAPI = async () => {
  const response = await axios.get<Tag[]>("http://localhost:5000/api/v1/tags");

  return response.data;
};

export const createTagAPI = async (data: {
  formData: { name: string };
  token: string | null;
}) => {
  const { formData, token } = data;

  await axios.post("http://localhost:5000/api/v1/tags", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTagAPI = async (data: {
  tagId: number;
  formData: { name: string };
  token: string | null;
}) => {
  const { tagId, formData, token } = data;

  await axios.put(`http://localhost:5000/api/v1/tags/${tagId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTagAPI = async (data: {
  tagId: number;
  token: string | null;
}) => {
  const { tagId, token } = data;

  await axios.delete(`http://localhost:5000/api/v1/tags/${tagId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const bulkDeleteTagsAPI = async (data: {
  tagIds: number[];
  token: string | null;
}) => {
  const { tagIds, token } = data;

  await axios.post("http://localhost:5000/api/v1/tags/bulk-delete",
    { tag_ids: tagIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
