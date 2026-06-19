import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { createCommentSchema } from './comment.schema';
import { z } from 'zod';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate data ด้วย Zod Schema
    const validatedData = createCommentSchema.parse(req.body);

    // เช็คว่า Blog ที่จะคอมเมนต์มีอยู่จริงหรือไม่
    const blogExists = await prisma.blog.findUnique({
      where: { id: validatedData.blogId }
    });

    if (!blogExists) {
      res.status(404).json({ error: 'ไม่พบ Blog ที่คุณต้องการคอมเมนต์' });
      return;
    }

    // บันทึกข้อมูลลงฐานข้อมูล พร้อมกำหนด Status เป็น PENDING เสมอ
    const newComment = await prisma.comment.create({
      data: {
        author: validatedData.author,
        content: validatedData.content,
        blogId: validatedData.blogId,
        status: 'PENDING',
      }
    });

    // ส่งสถานะ 201 Created กลับไปให้ Client
    res.status(201).json({
      message: 'สร้างคอมเมนต์สำเร็จ (รอการตรวจสอบจากแอดมิน)',
      data: newComment,
    });
  } catch (error) {
    // จับ Error ที่เกิดจาก Zod Validation
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'ข้อมูลไม่ถูกต้องตามรูปแบบที่กำหนด',
        details: error.issues.map((issue) => issue.message),
      });
      return;
    }

    // จับ Error อื่นๆ ฝั่ง Server
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
