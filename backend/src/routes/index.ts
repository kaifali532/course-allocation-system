import { Router } from 'express';
import authRoutes from './auth';
import studentRoutes from './student';
import courseRoutes from './course';
import allocationRoutes from './allocation';
import aiRoutes from './ai';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/allocations', allocationRoutes);
router.use('/ai', aiRoutes);

export default router;
