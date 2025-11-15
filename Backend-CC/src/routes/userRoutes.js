import express from 'express';
import { registerUser, loginUser, logoutUser, requestResetPassword, resetPassword } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Route untuk registrasi pengguna
router.post('/register', registerUser);

// Route untuk login pengguna
router.post('/login', loginUser);

// Route untuk logout pengguna
router.post('/logout', authenticate, logoutUser);

// Route untuk meminta reset password
router.post('/request-reset-password', requestResetPassword);

// Route untuk mengatur ulang password
router.post('/reset-password', resetPassword);

export default router;
