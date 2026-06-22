import { Router } from 'express';
import { getDashboardStats, getDashboardChart } from './dashboard.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/stats', requireAuth, getDashboardStats);
router.get('/chart', requireAuth, getDashboardChart);

export default router;
