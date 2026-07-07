import { Router } from 'express';
import { askAI, getHistory } from '../controllers/ai';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.post('/ask', askAI);
router.get('/history', getHistory);

export default router;
