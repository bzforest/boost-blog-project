import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { Prisma } from '@prisma/client';

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, page = '1', limit = '10' } = req.query;
    
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Filter for Published Blogs
    let whereCondition: Prisma.BlogWhereInput = {
      isPublished: true,
    };

    // Search & Fuzzy Search
    if (search && typeof search === 'string') {
      const searchKeyword = search.trim();
      const searchTerms = searchKeyword.split(/\s+/).filter(Boolean);
      
      whereCondition = {
        ...whereCondition,
        AND: searchTerms.map(term => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { excerpt: { contains: term, mode: 'insensitive' } }
          ]
        }))
      };
    }

    // ดึงข้อมูล Blog พร้อมนับจำนวนทั้งหมด (เพื่อทำ Pagination)
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: whereCondition,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          views: true,
          createdAt: true,
        }
      }),
      prisma.blog.count({ where: whereCondition }),
    ]);

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
      const skip = (pageNumber - 1) * limitNumber;
  
      let whereCondition: Prisma.BlogWhereInput = {};
  
      if (search && typeof search === 'string') {
        const searchKeyword = search.trim();
        const searchTerms = searchKeyword.split(/\s+/).filter(Boolean);
        
        whereCondition.AND = searchTerms.map(term => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { excerpt: { contains: term, mode: 'insensitive' } }
          ]
        }));
      }

      if (status && status !== 'all') {
        whereCondition.isPublished = status === 'published';
      }

      if (date) {
        const startDate = new Date(date as string);
        const endDate = new Date(date as string);
        endDate.setHours(23, 59, 59, 999);
  
        if (!isNaN(startDate.getTime())) {
          whereCondition.createdAt = {
            gte: startDate,
            lte: endDate,
          };
        }
      }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: whereCondition,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          views: true,
          isPublished: true,
          createdAt: true,
        }
      }),
      prisma.blog.count({ where: whereCondition }),
    ]);

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
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

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

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            author: true,
            content: true,
            createdAt: true,
          }
        }
      }
    });

    if (!blog || !blog.isPublished) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    }).catch(err => console.error('Error updating views:', err));

    res.json({ data: blog });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

import * as blogService from './blog.service';
import { createBlogSchema, updateBlogSchema, publishBlogSchema } from './blog.validation';

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

import { StorageService } from '../../services/storage.service';

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
