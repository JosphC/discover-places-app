import { z } from "zod";

const PostFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Max length is 100 characters" }),
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .max(1000, { message: "Max length is 1000 characters" }),
  status: z.string().min(1, { message: "Status is required" }),
  tagId: z.string().min(1, { message: "Tag is required" }),
});

export const CreatePostFormSchema = PostFormSchema;

export const EditPostFormSchema = PostFormSchema;

export type TCreatePostFormSchema = z.infer<typeof CreatePostFormSchema>;

export type TEditPostFormSchema = z.infer<typeof EditPostFormSchema>;
