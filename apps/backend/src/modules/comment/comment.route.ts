import { Router } from 'express';
import { createComment } from './comment.controller';

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
 *                 description: ชื่อผู้เขียนคอมเมนต์
 *               content:
 *                 type: string
 *                 description: เนื้อหาคอมเมนต์ (เฉพาะภาษาไทย ตัวเลข และช่องว่าง)
 *               blogId:
 *                 type: string
 *                 format: uuid
 *                 description: รหัส UUID ของ Blog
 *     responses:
 *       201:
 *         description: สร้างคอมเมนต์สำเร็จ รอการตรวจสอบจากแอดมิน
 *       400:
 *         description: ข้อมูลไม่ถูกต้องตาม Validation
 *       404:
 *         description: ไม่พบ Blog ที่ต้องการคอมเมนต์
 */
router.post('/', createComment);

export default router;
