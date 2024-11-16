import express from "express"
import {
  loginController,
  registerController,
  resendVerificationEmailController,
  verifyEmailController,
  sendRecoveryEmail,
  resetPasswordController,
} from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"
//
const authRouter = express.Router()

authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.get("/verify-email/:validation_token", verifyEmailController)
authRouter.post("/resend-verification", resendVerificationEmailController)
authRouter.post("/verify", verifyToken, verifyEmailController)
authRouter.post("/recovery-password", sendRecoveryEmail)
authRouter.put("/reset-password", resetPasswordController)

export default authRouter