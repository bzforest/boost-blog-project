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
