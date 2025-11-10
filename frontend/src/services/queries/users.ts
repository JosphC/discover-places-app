import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAPI } from "../api/users";
import { useAuthStore } from "@/stores/auth-store";

export const useGetCurrentUserQuery = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["currentUser", token],
    queryFn: () => getCurrentUserAPI(token),
    enabled: !!token,
  });
};
