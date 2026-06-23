import { Request, Response } from 'express';
import * as blogService from './blog.service';
import { createBlogSchema, updateBlogSchema, publishBlogSchema } from './blog.validation';
import { StorageService } from '../../services/storage.service';

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, page = '1', limit = '10', sort, date } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;

    const { blogs, total } = await blogService.getBlogs(search as string, pageNumber, limitNumber, sort as string, date as string);

    res.json({
      data: blogs,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAdminBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, page = '1', limit = '10', status, date } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;

    const { blogs, total } = await blogService.getAdminBlogs(search, pageNumber, limitNumber, status, date);

    res.json({
      data: blogs,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAdminBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const blog = await blogService.getBlogById(id);

    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    res.json({ data: blog });
  } catch (error) {
    console.error('Error fetching admin blog by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const blog = await blogService.getBlogBySlug(slug);

    if (!blog || !blog.isPublished) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    // Increment views asynchronously
    blogService.incrementBlogViews(blog.id).catch(err => console.error('Error updating views:', err));

    res.json({ data: blog });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = createBlogSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, error: parsedData.error.issues.map(e => e.message).join(', ') });
      return;
    }
    const blog = await blogService.createBlog(parsedData.data);
    res.status(201).json({ success: true, data: blog });
  } catch (error: any) {
    if (error.message === 'Slug already exists') {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsedData = updateBlogSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, error: parsedData.error.issues.map(e => e.message).join(', ') });
      return;
    }
    const blog = await blogService.updateBlog(id, parsedData.data);
    res.status(200).json({ success: true, data: blog });
  } catch (error: any) {
    if (error.code === 'P2025') {
       res.status(404).json({ success: false, error: 'Blog not found' });
       return;
    }
    if (error.message === 'Slug already exists') {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const publishBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const parsedData = publishBlogSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, error: parsedData.error.issues.map(e => e.message).join(', ') });
      return;
    }
    const blog = await blogService.publishBlog(id, parsedData.data.isPublished);
    res.status(200).json({ success: true, data: blog });
  } catch (error: any) {
    if (error.code === 'P2025') {
       res.status(404).json({ success: false, error: 'Blog not found' });
       return;
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await blogService.deleteBlog(id);
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
       res.status(404).json({ success: false, error: 'Blog not found' });
       return;
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const uploadBlogImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No image file provided' });
      return;
    }

    const imageUrl = await StorageService.uploadImage(req.file.buffer, req.file.mimetype, 'blog');
    
    res.status(201).json({ success: true, url: imageUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
