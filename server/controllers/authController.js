import bcrypt from 'bcryptjs';
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import transporter from '../config/nodemailer.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(404).json({
      success: false,
      message: "Name , Email and Password are required, Please check these Fields"
    })
  }
  try {
    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(404).json({
        success: false,
        message: "User with this Email already existed. Login with this Email or enter a new one"
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Welcome to FK Organization',
      text: `Welcome ${name} ,\nAn Acount has been created with this email ${email} \nThank you !`
    }
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    return res.status(201).json({
      success: true,
      message: "User Registered successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error
    })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({
      success: false,
      message: "Email and Password are required, Please check these Fields"
    })
  }
  try {
    const existedUser = await userModel.findOne({ email });
    if (!existedUser) {
      return res.status(404).json({
        success: false,
        message: "User with this Email does not exist."
      })
    }
    const isPasswordMatch = await bcrypt.compare(password, existedUser.password)
    if (!isPasswordMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid Password"
      })
    }
    const token = jwt.sign({ id: existedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(201).json({
      success: true,
      message: "User logged in successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error
    })
  }
}

export const logoutUser = async (req, res) => {

  try {
    res.clearCookie('token');
    return res.status(201).json({
      success: true,
      message: "User logged out successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error
    })
  }
}

export const sendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this id does dot exists"
      })
    }
    if (user.isAcountVerfied) {
      return res.status(400).json({
        success: false,
        message: "User is Already verfied"
      })
    }
    const generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = generatedOTP;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Acount Verification OTP',
      text: `Your OTP is ${generatedOTP} ,\nEnter this OTP to verify your Acount\nThank you!`
    }
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    return res.status(200).json({
      success: true,
      message: "OTP successfully sent to your email id"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error
    })
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await userModel.findById(userId);
    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Missing details"
      })
    }
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this id does dot exists"
      })
    }
    if (user.isAcountVerfied) {
      return res.status(400).json({
        success: false,
        message: "User is Already verfied"
      })
    }
    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      })
    }
    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has been expired generate a new one"
      })
    }
    user.isAcountVerfied = true;
    user.verifyOtpExpiresAt = 0;
    user.verifyOtp = '';
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Acount verified successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error
    })
  }
}