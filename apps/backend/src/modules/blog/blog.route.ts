import { Router } from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, publishBlog, deleteBlog } from './blog.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: ดึงข้อมูล Blog ทั้งหมด
 *     description: ค้นหาและดึงข้อมูล Blog ที่ Published แล้ว รองรับการแบ่งหน้า (Pagination) และการค้นหาเบื้องต้น
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: คำค้นหา (Title หรือ Excerpt)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: หมายเลขหน้า
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: จำนวนรายการต่อหน้า
 *     responses:
 *       200:
 *         description: สำเร็จ ส่งคืนรายการ Blog และ Meta Data สำหรับ Pagination
 */
router.get('/', getBlogs);

/**
 * @swagger
 * /api/blogs/{slug}:
 *   get:
 *     summary: ดึงข้อมูล Blog ตาม Slug
 *     description: ค้นหาและดึงรายละเอียดของ Blog (ที่ Published แล้ว) รวมถึงข้อมูล Comment ที่ได้รับการอนุมัติ (APPROVED)
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug ของ Blog ที่ต้องการดึงข้อมูล
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ ส่งคืนรายละเอียด Blog พร้อม Comments
 *       404:
 *         description: ไม่พบ Blog ที่ตรงกับ Slug นี้ หรือ Blog ยังไม่ Published
 */
router.get('/:slug', getBlogBySlug);

// Admin Endpoints (Protected)
router.post('/', requireAuth, createBlog);
router.put('/:id', requireAuth, updateBlog);
router.patch('/:id/publish', requireAuth, publishBlog);
router.delete('/:id', requireAuth, deleteBlog);

export default router;
