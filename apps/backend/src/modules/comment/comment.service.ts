import { prisma } from '../../lib/db';
import { Prisma } from '@prisma/client';

export const getBlogById = async (blogId: string) => {
  return await prisma.blog.findUnique({ where: { id: blogId } });
};

export const createComment = async (data: { author: string; content: string; blogId: string; parentId?: string | null }) => {
  return await prisma.comment.create({
    data: {
      author: data.author,
      content: data.content,
      blogId: data.blogId,
      parentId: data.parentId || null,
      status: 'PENDING',
    }
  });
};

export const getAdminComments = async (status: any, pageNumber: number, limitNumber: number, search: any, date: any) => {
  const skip = (pageNumber - 1) * limitNumber;
  const whereCondition: any = {};

  if (status && (status === 'PENDING' || status === 'APPROVED' || status === 'REJECTED')) {
    whereCondition.status = status;
  }

  if (search && typeof search === 'string') {
    whereCondition.OR = [
      { author: { contains: search, mode: 'insensitive' } },
      { blog: { title: { contains: search, mode: 'insensitive' } } }
    ];
  }

  if (date) {
    const startDate = new Date(date as string);
    const endDate = new Date(date as string);
    endDate.setHours(23, 59, 59, 999);
    if (!isNaN(startDate.getTime())) {
      whereCondition.createdAt = { gte: startDate, lte: endDate };
    }
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: whereCondition,
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
      include: {
        blog: {
          select: { title: true, slug: true },
        },
        parent: {
          select: { id: true, author: true, content: true },
        },
      },
    }),
    prisma.comment.count({ where: whereCondition }),
  ]);

  return { comments, total };
};

export const getCommentById = async (id: string) => {
  return await prisma.comment.findUnique({ where: { id } });
};

export const updateCommentStatus = async (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
  return await prisma.comment.update({
    where: { id },
    data: { status },
  });
};
