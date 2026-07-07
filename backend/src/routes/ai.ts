import { Router } from 'express';
import { askAI, getHistory, clearHistory } from '../controllers/ai';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.post('/ask', askAI);
router.get('/history', getHistory);
router.delete('/history', clearHistory);

export default router;
