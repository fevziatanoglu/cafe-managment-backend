import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById
} from '../controllers/productController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post('/', authenticate, authorizeRole('admin'), createProduct);
router.put('/:id', authenticate, authorizeRole('admin'), updateProduct);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteProduct);
router.get('/', authenticate, authorizeRole('admin'), getProducts);
router.get('/:id', authenticate, authorizeRole('admin'), getProductById);

export default router;
