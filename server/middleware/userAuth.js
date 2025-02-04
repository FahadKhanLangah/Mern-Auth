import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Login session expired. Please Login again"
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.body.userId = decoded.id
    } else {
      return res.status(404).json({
        success: false,
        message: "Login session expired. Please Login again"
      })
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}