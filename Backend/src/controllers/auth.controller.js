import ENVIRONMENT from "../config/environment.js"
import {
  hashPassword,
  comparePasswords,
  generateToken,
} from "../helpers/auth.js"
import { transportEmail } from "../helpers/transportEmail.js"
import ResponseBuilder from "../helpers/builders/responseBuilder.js"
import {
  emailVerification,
  verifyString,
  verifyMinLength,
} from "../helpers/validations.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body

    console.log("Datos recibidos:", req.body)

    const registerConfig = {
      username: {
        value: username,
        errors: [],
        validation: [
          verifyString,
          (field_name, field_value) =>
            verifyMinLength(field_name, field_value, 5),
        ],
      },
      email: {
        value: email,
        errors: [],
        validation: [
          (field_name, field_value) => emailVerification(field_value),
        ],
      },
      password: {
        value: password,
        errors: [],
        validation: [
          verifyString,
          (field_name, field_value) =>
            verifyMinLength(field_name, field_value, 8),
        ],
      },
    }

    let hayErrores = false

    for (let field_name in registerConfig) {
      for (let registerValidation of registerConfig[field_name].validation) {
        const result = registerValidation(
          field_name,
          registerConfig[field_name].value
        )

        if (result) {
          hayErrores = true
          registerConfig[field_name].errors.push(result)
        }
      }
    }

    if (hayErrores) {
      return res.status(400).json({
        ok: false,
        status: 400,
        data: { registerState: registerConfig },
        code: "VALIDATION_ERROR",
      })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        status: 409,
        code: "EMAIL_ALREADY_REGISTERED",
        message: "Email is already registered.",
      })
    }

    const hashedPassword = await hashPassword(password)

    const normalizedEmail = email.toLowerCase()

    const validationToken = generateToken(
      { email: normalizedEmail },
      { expiresIn: "1d" }
    )

    const redirectUrl = `http://localhost:5173/email-verified?validation_token=${validationToken}`

    await transportEmail.sendMail({
      subject: "Valida tu email",
      to: normalizedEmail,
      html: `
          <!DOCTYPE html>
          <html>
          <body>
            <h1>Valida tu mail</h1>
            <p>Para validar tu mail, haz clic en el siguiente enlace:</p>
            <p><a href="${redirectUrl}" style="color: blue text-decoration: underline">Valida tu email aquí</a></p>
          </body>
          </html>
        `,
    })

    const newUser = new User({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken: validationToken,
    })

    await newUser.save()

    const response = new ResponseBuilder()
      .setOk(true)
      .setStatus(201)
      .setCode("SUCCESS")
      .setData({
        message: "User registered successfully",
        user: { username, email },
      })
      .build()

    return res.json(response)
  } catch (error) {
    console.error("Error during registration:", error)

    if (error.code === 11000) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(409)
        .setCode("EMAIL_ALREADY_REGISTERED")
        .setMessage("Email already registered")
        .setData({
          detail: "Email already registered",
        })
        .build()
      return res.status(409).json(response)
    } else {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setCode("INTERNAL_SERVER_ERROR")
        .setMessage("Internal server error")
        .setData({
          detail: error.message,
        })
        .build()
      return res.json(response)
    }
  }
}

export const verifyEmailController = async (req, res) => {
  try {
    const validation_token = req.params.validation_token

    if (!validation_token) {
      return res
        .status(400)
        .json({ success: false, message: "Token wasnt provided correctly" })
    }

    let decoded
    try {
      decoded = jwt.verify(validation_token, ENVIRONMENT.JWT_SECRET)
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" })
    }

    const { email } = decoded
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" })
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Your email is already verified",
      })
    }

    user.emailVerified = true
    await user.save()

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" })
  } catch (error) {
    console.error("Error verifying token:", error)

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" })
    }

    res.status(500).json({
      success: false,
      message: "There was an error verifying the email",
      error: error.message,
    })
  }
}

export const resendVerificationEmailController = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to resend the verification link",
      })
    }

    const normalizedEmail = email.toLowerCase()

    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided email",
      })
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      })
    }

    const validationToken = jwt.sign(
      { email: normalizedEmail },
      ENVIRONMENT.JWT_SECRET,
      { expiresIn: "1d" }
    )

    user.verificationToken = validationToken
    await user.save()

    const redirectUrl = `http://localhost:5173/email-verified?validation_token=${validationToken}`
    await transportEmail.sendMail({
      subject: "Resend: Valida tu email",
      to: normalizedEmail,
      html: `
          <!DOCTYPE html>
          <html>
          <body>
            <h1>Valida tu mail nuevamente</h1>
            <p>Parece que aún no has validado tu correo. Haz clic en el siguiente enlace:</p>
            <p><a href="${redirectUrl}" style="color: blue text-decoration: underline">Valida tu email aquí</a></p>
          </body>
          </html>
        `,
    })

    return res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
    })
  } catch (error) {
    console.error("Error resending verification email:", error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

export const checkEmailVerificationController = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.emailVerified) {
      return res.status(200).json({ message: "Email is already verified" })
    } else {
      return res.status(400).json({ message: "Email is not verified yet" })
    }
  } catch (error) {
    console.error("Error checking email verification:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const loginController = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const isPasswordCorrect = await comparePasswords(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.status(200).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const recoveryPasswordController = async (req, res) => {}

export const forgotPasswordController = async (req, res) => {}
