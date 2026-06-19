import { z } from 'zod';

export const createCommentSchema = z.object({
  author: z.string({ message: 'Author is required' })
    .min(1, 'Author cannot be empty'),
  content: z.string({ message: 'Content is required' })
    .regex(/^[ก-๙0-9\s]+$/, 'ข้อความ Comment ต้องเป็นภาษาไทยและ/หรือตัวเลขเท่านั้น'),
  blogId: z.string({ message: 'Blog ID is required' })
    .uuid('Blog ID must be a valid UUID'),
});
