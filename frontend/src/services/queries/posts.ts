import { useQuery } from "@tanstack/react-query";
import { getAllPostsAPI, getPostsOnUserAPI } from "../api/posts";

export const useGetAllPostsQuery = () => {
  return useQuery({
    queryKey: ["posts", "all"],
    queryFn: getAllPostsAPI,
  });
};

export const useGetPostsOnUserQuery = () => {
  return useQuery({
    queryKey: ["posts", "user"],
    queryFn: getPostsOnUserAPI,
  });
};
