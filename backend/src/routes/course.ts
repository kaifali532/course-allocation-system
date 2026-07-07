import { Router } from 'express';
import { createCourse, getCourses, updateCourse, deleteCourse } from '../controllers/course';
import { validate } from '../middlewares/validate';
import { createCourseSchema } from '../validation/course';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.post('/', validate(createCourseSchema), createCourse);
router.get('/', getCourses);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
