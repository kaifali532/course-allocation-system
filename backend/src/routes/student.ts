import { Router } from 'express';
import { createStudent, getStudents, updateStudent, deleteStudent } from '../controllers/student';
import { validate } from '../middlewares/validate';
import { createStudentSchema } from '../validation/student';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.post('/', validate(createStudentSchema), createStudent);
router.get('/', getStudents);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
