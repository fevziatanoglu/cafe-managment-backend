import express from 'express';
import { createMenu, updateMenu, deleteMenu } from '../controllers/menuController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post('/', authenticate, authorizeRole('admin'), createMenu);
router.put('/:id', authenticate, authorizeRole('admin'), updateMenu);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteMenu);

export default router;
