import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { createCommentSchema } from './comment.schema';
import { z } from 'zod';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createCommentSchema.parse(req.body);

    const blogExists = await prisma.blog.findUnique({
      where: { id: validatedData.blogId }
    });

    if (!blogExists) {
      res.status(404).json({ error: 'ไม่พบ Blog ที่คุณต้องการคอมเมนต์' });
      return;
    }

    const newComment = await prisma.comment.create({
      data: {
        author: validatedData.author,
        content: validatedData.content,
        blogId: validatedData.blogId,
        parentId: validatedData.parentId || null,
        status: 'PENDING',
      }
    });

    res.status(201).json({
      message: 'สร้างคอมเมนต์สำเร็จ (รอการตรวจสอบจากแอดมิน)',
      data: newComment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'ข้อมูลไม่ถูกต้องตามรูปแบบที่กำหนด',
        details: error.issues.map((issue) => issue.message),
      });
      return;
    }
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// --- Admin: Get All Comments ---
export const getAdminComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '50', search, date } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 50;
    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition: any = {};
    if (status && (status === 'PENDING' || status === 'APPROVED' || status === 'REJECTED')) {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition.OR = [
        { author: { contains: search as string, mode: 'insensitive' } },
        { blog: { title: { contains: search as string, mode: 'insensitive' } } }
      ];
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

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: whereCondition,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
        include: {
          blog: {
            select: {
              title: true,
              slug: true,
            },
          },
          parent: {
            select: {
              id: true,
              author: true,
              content: true,
            },
          },
        },
      }),
      prisma.comment.count({ where: whereCondition }),
    ]);

    res.json({
      data: comments,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching admin comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// --- Admin: Approve Comment ---
export const approveComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }
    console.error('Error approving comment:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// --- Admin: Reject Comment (Soft Delete) ---
export const rejectComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }
    console.error('Error rejecting comment:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// --- Admin: Restore Comment ---
export const restoreComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }
    console.error('Error restoring comment:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
