import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
