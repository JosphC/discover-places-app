import { z } from "zod";

export const ReviewSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string()
    .min(1, "Comment is required")
    .max(500, "Comment must be less than 500 characters"),
});

export type TReviewSchema = z.infer<typeof ReviewSchema>;
