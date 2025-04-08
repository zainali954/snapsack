import express from 'express';
import { register, login, logout, getProfile, refreshToken, addAddress, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, removeAddress, googleLogin } from '../controllers/auth.controller.js';
import { loginValidation, registerValidation } from '../validation/authValidation.js';
import verifyAuth from '../middlewares/verifyAuth.js';

const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/logout', logout);
router.post('/verify-email', verifyAuth, verifyEmail);
router.post('/resend-verification-email', verifyAuth, resendVerificationEmail)
router.get('/profile', verifyAuth, getProfile);
router.post('/refresh-access-token', refreshToken);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/add-address', verifyAuth, addAddress);
router.post('/remove-address/:index', verifyAuth, removeAddress);


export default router;
