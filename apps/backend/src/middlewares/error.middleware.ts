import { Request, Response, NextFunction } from 'express';

// Global Error Handler Middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('[Global Error]:', err);

  const isDev = process.env.NODE_ENV === 'development';

  // ส่ง Response กลับไปให้ Client แบบ JSON เสมอ ป้องกันแอป Crash แล้วพ่น HTML
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'เกิดข้อผิดพลาดบางอย่างที่ระบบหลังบ้าน',
    // พ่น stack trace เฉพาะตอน dev เพื่อความปลอดภัยของระบบ Production
    stack: isDev ? err.stack : undefined,
  });
};
