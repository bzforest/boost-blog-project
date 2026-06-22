import { Router } from 'express';
import { createComment, getAdminComments, approveComment, rejectComment, restoreComment } from './comment.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: สร้าง Comment ใหม่
 *     description: สร้างคอมเมนต์สำหรับ Blog โดยมีสถานะเริ่มต้นเป็น PENDING เสมอ
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - content
 *               - blogId
 *             properties:
 *               author:
 *                 type: string
 *               content:
 *                 type: string
 *               blogId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: สร้างคอมเมนต์สำเร็จ รอการตรวจสอบจากแอดมิน
 *       400:
 *         description: ข้อมูลไม่ถูกต้องตาม Validation
 *       404:
 *         description: ไม่พบ Blog ที่ต้องการคอมเมนต์
 */
router.post('/', createComment);

// Admin Endpoints (Protected)
router.get('/admin/list', requireAuth, getAdminComments);
router.patch('/admin/:id/approve', requireAuth, approveComment);
router.patch('/admin/:id/reject', requireAuth, rejectComment);
router.patch('/admin/:id/restore', requireAuth, restoreComment);

export default router;
