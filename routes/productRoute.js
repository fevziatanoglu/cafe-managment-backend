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
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', authenticate, authorizeRole('admin'), upload.single('image'), createProduct);
router.put('/:id', authenticate, authorizeRole('admin'), upload.single('image'), updateProduct);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteProduct);
router.get('/', authenticate, authorizeRole('admin'), getProducts);
router.get('/:id', authenticate, authorizeRole('admin'), getProductById);

export default router;
