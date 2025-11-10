import axios from "axios";
import { ENV } from "@/config/env";
import type { User } from "@/types/types";

export const getCurrentUserAPI = async (token: string | null) => {
  const { data } = await axios.get<User>(
    `${ENV.API_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
