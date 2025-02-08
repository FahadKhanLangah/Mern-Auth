import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpiresAt: { type: Number, default: 0 },
  resetOtp: { type: String, default: '' },
  resetOtpExpiresAt: { type: Number, default: 0 },
  isAcountVerfied: { type: Boolean, default: false },
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;