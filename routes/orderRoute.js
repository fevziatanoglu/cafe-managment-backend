import express from 'express';
import {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrders,
    getOrderById,
    getPendingOrders,
    createPaidOrder
} from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.put('/:id', authenticate, updateOrder);
router.delete('/:id', authenticate, deleteOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.get('/pending', authenticate, getPendingOrders);
router.post('/paid', authenticate, createPaidOrder);

export default router;
