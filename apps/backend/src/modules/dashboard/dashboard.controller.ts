import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [totalBlogs, pendingComments, viewsData, activeGallery] = await Promise.all([
      prisma.blog.count(),
      prisma.comment.count({ where: { status: 'PENDING' } }),
      prisma.blog.aggregate({ _sum: { views: true } }),
      prisma.galleryImage.count()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBlogs,
        pendingComments,
        totalViews: viewsData._sum.views || 0,
        activeGallery
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getDashboardChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const startDate = new Date(last7Days[0]);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const [blogs, comments] = await Promise.all([
      prisma.blog.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true },
      }),
      prisma.comment.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true },
      }),
    ]);

    const data = last7Days.map(date => {
      const dateString = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(date);
      
      const isSameDate = (d1: Date, d2: Date) => 
        d1.getDate() === d2.getDate() && 
        d1.getMonth() === d2.getMonth() && 
        d1.getFullYear() === d2.getFullYear();

      const blogCount = blogs.filter(b => isSameDate(new Date(b.createdAt), date)).length;
      const commentCount = comments.filter(c => isSameDate(new Date(c.createdAt), date)).length;

      return {
        date: dateString,
        blogs: blogCount,
        comments: commentCount
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching dashboard chart data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

