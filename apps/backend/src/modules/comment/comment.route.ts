import { Router } from 'express';
import { createComment } from './comment.controller';

const router = Router();

router.post('/', createComment);

export default router;
