import express from 'express';
import {
    createWorker,
    getWorkers,
    getWorkerById,
    getWorkerByUsername,
    updateWorker,
    deleteWorker
} from '../controllers/workerController.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, authorizeRole('admin'), createWorker);
router.get('/', authenticate, authorizeRole('admin'), getWorkers);
router.get('/username/:username', authenticate, authorizeRole('admin'), getWorkerByUsername);
router.get('/:id', authenticate, authorizeRole('admin'), getWorkerById);
router.put('/:id', authenticate, authorizeRole('admin'), updateWorker);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteWorker);

export default router;
