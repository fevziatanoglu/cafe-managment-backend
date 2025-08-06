import express from 'express';
import { createStaff, deleteStaff, getStaff, getStaffById, getStaffByUsername, updateStaff } from '../controllers/staffController.js';
import upload from '../middlewares/upload.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post(
    '/',
    authenticate,
    authorizeRole('admin'),
    upload.single('image'),
    createStaff
);

router.put(
    '/:id',
    authenticate,
    authorizeRole('admin'),
    upload.single('image'),
    updateStaff
);

// Get all staff
router.get(
    '/',
    authenticate,
    authorizeRole('admin'),
    getStaff
);

router.get(
    '/:id',
    authenticate,
    authorizeRole('admin'),
    getStaffById
);

router.get(
    '/username/:username',
    authenticate,
    authorizeRole('admin'),
    getStaffByUsername
);

router.delete(
    '/:id',
    authenticate,
    authorizeRole('admin'),
    deleteStaff
);

export default router;
