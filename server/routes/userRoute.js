import express from 'express'
import isAuth from '../middleware/userAuth.js';
import { userDetail } from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.get('/data', isAuth, userDetail);

export default userRoute;