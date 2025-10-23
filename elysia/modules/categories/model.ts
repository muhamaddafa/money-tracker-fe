import { z } from "zod";

export const addCategorySchema = z.object({
  description: z.string(),
  type: z.enum(["income", "expense"])
});

export const editCategorySchema = z.object({
  id: z.string(),
  description: z.string(),
});

export type AddCategoryRequest = z.infer<typeof addCategorySchema>;
export type EditCategoryRequest = z.infer<typeof editCategorySchema>;