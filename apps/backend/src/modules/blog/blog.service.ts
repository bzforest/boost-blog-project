import { prisma } from '../../lib/db';
import { Prisma } from '@prisma/client';

export const getBlogs = async (search: string | undefined, pageNumber: number, limitNumber: number, sort: string | undefined, date: string | undefined) => {
  const skip = (pageNumber - 1) * limitNumber;
  let whereCondition: Prisma.BlogWhereInput = { isPublished: true };

  if (search && typeof search === 'string') {
    const searchTerms = search.trim().split(/\s+/).filter(Boolean);
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

  if (date) {
    const selectedDate = new Date(date as string);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    if (!isNaN(selectedDate.getTime())) {
      whereCondition.createdAt = {
        gte: selectedDate,
        lt: nextDate,
      };
    }
  }

  let orderBy: Prisma.BlogOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'date_asc') orderBy = { createdAt: 'asc' };
  else if (sort === 'views_desc') orderBy = { views: 'desc' };
  else if (sort === 'views_asc') orderBy = { views: 'asc' };
  else if (sort === 'title_asc') orderBy = { title: 'asc' };

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where: whereCondition,
      skip,
      take: limitNumber,
      orderBy,
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

  return { blogs, total };
};

export const getAdminBlogs = async (search: any, pageNumber: number, limitNumber: number, status: any, date: any) => {
  const skip = (pageNumber - 1) * limitNumber;
  let whereCondition: Prisma.BlogWhereInput = {};

  if (search && typeof search === 'string') {
    const searchTerms = search.trim().split(/\s+/).filter(Boolean);
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
      whereCondition.createdAt = { gte: startDate, lte: endDate };
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

  return { blogs, total };
};

export const getBlogById = async (id: string) => {
  return await prisma.blog.findUnique({ where: { id } });
};

export const getBlogBySlug = async (slug: string) => {
  return await prisma.blog.findUnique({
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
};

export const incrementBlogViews = async (id: string) => {
  return await prisma.blog.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
};

export const createBlog = async (data: Prisma.BlogCreateInput) => {
  const existingBlog = await prisma.blog.findUnique({ where: { slug: data.slug } });
  if (existingBlog) {
    throw new Error('Slug already exists');
  }
  return await prisma.blog.create({ data });
};

export const updateBlog = async (id: string, data: Prisma.BlogUpdateInput) => {
  if (data.slug) {
    const existingBlog = await prisma.blog.findUnique({ where: { slug: data.slug as string } });
    if (existingBlog && existingBlog.id !== id) {
      throw new Error('Slug already exists');
    }
  }
  return await prisma.blog.update({
    where: { id },
    data,
  });
};

export const publishBlog = async (id: string, isPublished: boolean) => {
  return await prisma.blog.update({
    where: { id },
    data: { isPublished },
  });
};

export const deleteBlog = async (id: string) => {
  return await prisma.blog.delete({
    where: { id },
  });
};
