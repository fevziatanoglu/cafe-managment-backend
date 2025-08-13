import express from 'express';
import { createCafe, getCafeByAdminId, updateCafe } from '../controllers/cafeController.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', authenticate, authorizeRole('admin'), getCafeByAdminId);
router.post('/', authenticate, authorizeRole('admin'), createCafe);
router.put('/:id', authenticate, authorizeRole('admin'), updateCafe);

export default router;
