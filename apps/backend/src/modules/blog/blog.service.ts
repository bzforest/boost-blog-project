import { prisma } from '../../lib/db';
import { Prisma } from '@prisma/client';

export const createBlog = async (data: Prisma.BlogCreateInput) => {
  const existingBlog = await prisma.blog.findUnique({ where: { slug: data.slug } });
  if (existingBlog) {
    throw new Error('Slug already exists');
  }
  return await prisma.blog.create({ data });
};

export const updateBlog = async (id: string, data: Prisma.BlogUpdateInput) => {
  // If updating slug, check uniqueness
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
