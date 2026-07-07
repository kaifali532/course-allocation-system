import { Router } from 'express';
import { createStudent, getStudents } from '../controllers/student';
import { validate } from '../middlewares/validate';
import { createStudentSchema } from '../validation/student';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.post('/', validate(createStudentSchema), createStudent);
router.get('/', getStudents);

export default router;
