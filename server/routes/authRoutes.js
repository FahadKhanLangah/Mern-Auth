import express from 'express';
import { isAuthenticated, loginUser, logoutUser, registerUser, sendOtp, sendResetOTP, verifyOtp, verifyResetOTP } from '../controllers/authController.js';
import isAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register-user', registerUser);
authRouter.post('/login-user', loginUser);
authRouter.post('/logout-user', logoutUser);
authRouter.post('/send-verify-otp', isAuth, sendOtp);
authRouter.post('/acount-verified', isAuth, verifyOtp);
authRouter.post('/is-authenticated', isAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOTP);
authRouter.post('/verify-reset-otp', verifyResetOTP);

export default authRouter;
