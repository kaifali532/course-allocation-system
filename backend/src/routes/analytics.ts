import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAnalytics);

export default router;
