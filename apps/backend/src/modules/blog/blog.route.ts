import { Router } from 'express';
import { getBlogs, getBlogBySlug } from './blog.controller';

const router = Router();

// Route: GET /api/blogs
router.get('/', getBlogs);

// Route: GET /api/blogs/:slug
router.get('/:slug', getBlogBySlug);

export default router;
