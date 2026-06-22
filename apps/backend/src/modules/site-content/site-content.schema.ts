import { z } from "zod";

// Schema for updating status/details of an image
export const updateContentSchema = z.object({
  isActive: z.boolean().optional(),
  altText: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});
