import nodemailer from 'nodemailer';
import { config  } from 'dotenv';
config();

const transporter = nodemailer.createTransport({
  // host: "smtp.gmail.com",
  // port: 587,
  // secure: false, 
  service : "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;