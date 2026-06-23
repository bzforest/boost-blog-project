import { Request, Response } from 'express';
import { createCommentSchema } from './comment.schema';
import * as commentService from './comment.service';
import { z } from 'zod';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createCommentSchema.parse(req.body);

    const blogExists = await commentService.getBlogById(validatedData.blogId);
    if (!blogExists) {
      res.status(404).json({ error: 'ไม่พบ Blog ที่คุณต้องการคอมเมนต์' });
      return;
    }

    const newComment = await commentService.createComment(validatedData);

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

export const getAdminComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '50', search, date } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 50;

    const { comments, total } = await commentService.getAdminComments(status, pageNumber, limitNumber, search, date);

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

export const approveComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const comment = await commentService.getCommentById(id);
    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    const updated = await commentService.updateCommentStatus(id, 'APPROVED');
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

export const rejectComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const comment = await commentService.getCommentById(id);
    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    const updated = await commentService.updateCommentStatus(id, 'REJECTED');
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

export const restoreComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const comment = await commentService.getCommentById(id);
    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    const updated = await commentService.updateCommentStatus(id, 'APPROVED');
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
