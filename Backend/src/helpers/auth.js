import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import ENVIRONMENT from "../config/environment.js"
import dotenv from "dotenv"
import User from "../models/UserModel.js"

dotenv.config()

export const generateToken = (payload) => {
  const secretKey = ENVIRONMENT.JWT_SECRET
  if (!secretKey) throw new Error("JWT_SECRET is not defined")
  return jwt.sign(payload, secretKey, { expiresIn: "1h" })
}

export const refreshToken = async (oldToken) => {
  let objToken = await this.tokenRepository.findOne({ hash: oldToken })
  if (objToken) {
    let user = await this.userService.findOneOrFail({ email: objToken.email })
    return this.authService.login(user)
  } else {
    return new UnauthorizedException(MessagesHelper.TOKEN_INVALID)
  }
}

export const comparePasswords = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const verifyEmailHelper = async (email) => {
    const user = await User.findOne({ email })
    return user
}