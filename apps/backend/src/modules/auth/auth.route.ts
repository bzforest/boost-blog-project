import { Router } from 'express';
import * as authController from './auth.controller';
import { loginRateLimiter } from '../../middlewares/rateLimit.middleware';

const router = Router();

router.post('/login', loginRateLimiter, authController.login);

export default router;
