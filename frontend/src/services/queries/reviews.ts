import { useQuery } from "@tanstack/react-query";
import { getAllReviewsByPostAPI, getReviewByIdAPI } from "../api/reviews";

export const useGetAllReviewsByPostQuery = (postId: number) => {
  return useQuery({
    queryKey: ["reviews", "post", postId],
    queryFn: () => getAllReviewsByPostAPI(postId),
    enabled: !!postId,
  });
};

export const useGetReviewByIdQuery = (reviewId: number) => {
  return useQuery({
    queryKey: ["reviews", reviewId],
    queryFn: () => getReviewByIdAPI(reviewId),
    enabled: !!reviewId,
  });
};
