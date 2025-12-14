import { Router } from 'express';
import { getFeed } from '../controllers/feedController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getFeed);

export default router;

