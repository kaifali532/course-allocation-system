import { Router } from 'express';
import authRoutes from './auth';
import studentRoutes from './student';
import courseRoutes from './course';
import allocationRoutes from './allocation';
import aiRoutes from './ai';
import settingsRoutes from './settings';
import analyticsRoutes from './analytics';
import uploadRoutes from './upload';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/allocation', allocationRoutes);
router.use('/ai', aiRoutes);
router.use('/settings', settingsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/upload', uploadRoutes);

export default router;
