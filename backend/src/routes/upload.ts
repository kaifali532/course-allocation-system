import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadAvatar } from '../controllers/upload';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Use /tmp on serverless (Vercel), otherwise use local public/uploads
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
const uploadDir = isServerless
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../../public/uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create upload directory:', err);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure dir exists at request time too (safety for serverless cold starts)
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (e) {
      // ignore
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

router.use(authenticate);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

export default router;
