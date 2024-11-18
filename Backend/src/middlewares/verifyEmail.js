import responseBuilder from "../helpers/builders/responseBuilder.js"
import jwt from "jsonwebtoken"
import User from "../models/UserModel.js"

export const verifyEmailVerified = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json(
        responseBuilder
          .setOk(false)
          .setMessage("User not found")
          .setCode("USER_NOT_FOUND")
          .build()
      )
    }

    if (!user.emailVerified) {
      return res.status(403).json(
        responseBuilder
          .setOk(false)
          .setMessage("Email not verified")
          .setCode("EMAIL_NOT_VERIFIED")
          .build()
      )
    }

    next()

  } catch (error) {
    console.error("Error verifying token or user:", error)
    return res.status(500).json(
      responseBuilder
        .setOk(false)
        .setMessage("Failed to verify token or user")
        .setCode("TOKEN_VERIFICATION_FAILED")
        .build()
    )
  }
}