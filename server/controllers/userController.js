import userModel from "../models/userModel.js";


export const userDetail = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    return res.status(200).json({
      success: true,
      userDetail: {
        name: user.name,
        email: user.email,
        isAcountVerfied: user.isAcountVerfied
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}