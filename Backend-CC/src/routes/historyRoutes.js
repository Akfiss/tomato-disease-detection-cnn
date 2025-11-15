import express from 'express';
import { getUserDetectionHistory } from '../controllers/historyController.js';
import { authenticate } from '../middleware/authenticate.js';
import { paginate } from '../middleware/pagination.js';

const router = express.Router();

router.get('/history', authenticate, paginate, getUserDetectionHistory);

export default router;
