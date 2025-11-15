import express from 'express';
import { detectDisease } from '../controllers/detectionController.js';
import { uploadSingle } from '../middleware/fileUpload.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/detect', authenticate, uploadSingle, detectDisease);

export default router;
