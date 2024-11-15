import express from "express"
import {
  loginController,
  registerController,
  verifyEmailController,
  resendVerificationEmailController,
  checkEmailVerificationController,
  forgotPasswordController,
  recoveryPasswordController,
} from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"
//
const authRouter = express.Router()

authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.get("/verify-email/:validation_token", verifyEmailController)
authRouter.post("/resend-verification", resendVerificationEmailController)
authRouter.post("/verify", verifyToken, checkEmailVerificationController)
// authRouter.post('/forgot-password', forgotPasswordController)
// authRouter.put('/recovery-password', recoveryPasswordController)

export default authRouter
