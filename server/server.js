import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import connectDb from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRoute from './routes/userRoute.js';
config();
const PORT = process.env.PORT || 4000;
connectDb();
const app = express()
app.use(express.json())
app.use(cors());
app.use(cookieParser({ Credential: true }));

app.use('/api/v1', authRouter);
app.use('/api/v1/user', userRoute );
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})