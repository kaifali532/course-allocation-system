import { Router } from 'express';
import { runAllocation, resetAllocation, getAllocations } from '../controllers/allocation';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));

router.post('/run', runAllocation);
router.post('/reset', resetAllocation);
router.get('/', getAllocations);

export default router;
