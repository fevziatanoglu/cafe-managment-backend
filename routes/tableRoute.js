import express from 'express';
import {
    createTable,
    updateTable,
    deleteTable,
    getTables,
    getTableById,
    getTablesWithActiveOrder
} from '../controllers/tableController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

router.get('/with-orders', authenticate, getTablesWithActiveOrder);
router.post('/', authenticate, createTable);
router.put('/:id', authenticate, updateTable);
router.delete('/:id', authenticate, authorizeRole("admin") , deleteTable);
router.get('/', authenticate, getTables);
router.get('/:id', authenticate, getTableById);

export default router;
