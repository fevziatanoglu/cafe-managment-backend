import express from 'express';
import { register, login, refreshAccessToken, logout } from '../controllers/authController.js';
import { loginValidator, registerValidator } from '../validators/authValidators.js';
import { validate } from '../middlewares/validate.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post('/register', registerValidator, authorizeRole("admin") , validate ,validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshAccessToken);

export default router;
