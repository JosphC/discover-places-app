import { z } from "zod";

export const CommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

export type TCommentSchema = z.infer<typeof CommentSchema>;
