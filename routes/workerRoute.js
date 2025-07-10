import express from 'express';
import {
    createWorker,
    getWorkers,
    getWorkerById,
    updateWorker,
    deleteWorker
} from '../controllers/workerController.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

// Sadece adminler worker işlemleri yapabilir
router.post('/', authorizeRole('admin'), createWorker);
router.get('/', authorizeRole('admin'), getWorkers);
router.get('/:id', authorizeRole('admin'), getWorkerById);
router.put('/:id', authorizeRole('admin'), updateWorker);
router.delete('/:id', authorizeRole('admin'), deleteWorker);

export default router;
