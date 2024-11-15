import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const verifyToken = async (req, res, next) => {
  const { validation_token } = req.params

  try {
    const user = await User.findOne({ validationToken: validation_token })
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    const isValid = jwt.verify(validation_token, process.env.JWT_SECRET)
    if (!isValid) {
      return res.status(400).json({ message: "Token expired or invalid" })
    }

    next()
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: "Server error during email verification" })
  }
}

export const checkEmailVerification = async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return { success: false, message: "User not found" };
      }
  
      if (user.emailVerified) {
        return { success: true, message: "Email is verified" };
      } else {
        return { success: false, message: "Email is not verified" };
      }

    } catch (error) {
      console.error(error);
      return { success: false, message: "Error checking email verification" };
    }
  }