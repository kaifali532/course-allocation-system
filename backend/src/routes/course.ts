import { Router } from 'express';
import { createCourse, getCourses } from '../controllers/course';
import { validate } from '../middlewares/validate';
import { createCourseSchema } from '../validation/course';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.post('/', validate(createCourseSchema), createCourse);
router.get('/', getCourses);

export default router;
