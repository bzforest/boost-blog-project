import { z } from "zod";

// Schema for updating status/details of an image
export const updateContentSchema = z.object({
  isActive: z.boolean().optional(),
  altText: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

// Schema for bulk updating isActive status
export const bulkUpdateSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().min(1),
      isActive: z.boolean(),
    })
  ).min(1, "At least one update is required"),
});
