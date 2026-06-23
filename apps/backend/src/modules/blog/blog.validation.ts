import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens without spaces'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt is too long'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().url('Cover image must be a valid URL'),
  images: z
    .array(z.string().url('Images must be valid URLs'))
    .max(6, 'Cannot upload more than 6 images')
    .optional()
    .default([]),
  isPublished: z.boolean().optional().default(false),
});

export const updateBlogSchema = createBlogSchema.partial();

export const publishBlogSchema = z.object({
  isPublished: z.boolean({ message: 'isPublished is required and must be a boolean' }),
});
