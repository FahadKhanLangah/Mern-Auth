import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register-user',registerUser);
authRouter.post('/login-user',loginUser);
authRouter.post('/logout-user',logoutUser);

export default authRouter;
