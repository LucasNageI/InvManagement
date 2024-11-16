import {
  hashPassword,
  comparePasswords,
  generateToken,
  verifyEmailHelper,
} from "../helpers/auth.js"
import { transportEmail } from "../helpers/transportEmail.js"
import ResponseBuilder from "../helpers/builders/responseBuilder.js"
import {
  emailVerification,
  verifyString,
  verifyMinLength,
} from "../helpers/validations.js"
import User from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.js"

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body

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
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setData({ registerState: registerConfig })
        .setCode("VALIDATION_ERROR")
        .build()
      return res.status(400).json(response)
    }

    const emailVerificationResult = await verifyEmailHelper(email)
    if (emailVerificationResult) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(409)
        .setCode("EMAIL_ALREADY_REGISTERED")
        .setMessage("Email is already registered.")
        .build()
      return res.status(409).json(response)
    }

    const hashedPassword = await hashPassword(password)

    const normalizedEmail = email.toLowerCase()

    const validationToken = generateToken({ email: normalizedEmail })

    const redirectUrl = `${ENVIRONMENT.FRONTEND_URL}/email-verified?validation_token=${validationToken}`

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

    const response = new ResponseBuilder()
      .setOk(false)
      .setStatus(500)
      .setCode("INTERNAL_SERVER_ERROR")
      .setMessage("Internal server error")
      .setData({
        detail: error.message,
      })
      .build()

    return res.status(500).json(response)
  }
}

export const loginController = async (req, res) => {
  const { email, password } = req.body
  const response = new ResponseBuilder()

  try {
    const user = await verifyEmailHelper(email)
    if (!user) {
      return res
        .status(400)
        .json(
          response
            .setOk(false)
            .setStatus(400)
            .setMessage("User not found")
            .build()
        )
    }
    const isPasswordCorrect = await comparePasswords(password, user.password)
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json(
          response
            .setOk(false)
            .setStatus(400)
            .setMessage("Invalid credentials")
            .build()
        )
    }

    if (!user.emailVerified) {
      return res
        .status(400)
        .json(
          response
            .setOk(false)
            .setStatus(400)
            .setMessage("Please verify your email before logging in")
            .build()
        )
    }

    const token = generateToken({ userId: user._id, email: user.email })

    return res.status(200).json(
      response
        .setOk(true)
        .setStatus(200)
        .setMessage("Login successful")
        .setData({
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
            company: user.company,
          },
        })
        .build()
    )
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json(
        response.setOk(false).setStatus(500).setMessage("Server error").build()
      )
  }
}

export const resendVerificationEmailController = async (req, res) => {
  const { email } = req.body
  const response = new ResponseBuilder()

  try {
    if (!email) {
      return res
        .status(400)
        .json(
          response
            .setOk(false)
            .setStatus(400)
            .setMessage("Email is required")
            .build()
        )
    }

    const normalizedEmail = email.toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res
        .status(404)
        .json(
          response
            .setOk(false)
            .setStatus(404)
            .setMessage("User not found")
            .build()
        )
    }

    if (user.emailVerified) {
      return res
        .status(400)
        .json(
          response
            .setOk(false)
            .setStatus(400)
            .setMessage("Email is already verified")
            .build()
        )
    }

    const validationToken = jwt.sign(
      { email: normalizedEmail },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    )

    user.verificationToken = validationToken
    await user.save()

    const redirectUrl = `${process.env.FRONTEND_URL}/email-verified?validation_token=${validationToken}`

    await transportEmail.sendMail({
      subject: "Resend: Validate your email",
      to: normalizedEmail,
      html: `
          <h1>Validate your email</h1>
          <p>Click the link below to validate your email:</p>
          <a href="${redirectUrl}">Validate your email here</a>
        `,
    })

    return res
      .status(200)
      .json(
        response
          .setOk(true)
          .setStatus(200)
          .setMessage("Verification email resent successfully")
          .build()
      )
  } catch (error) {
    console.error("Error in resendVerificationEmailController:", error.message)
    return res
      .status(500)
      .json(
        response
          .setOk(false)
          .setStatus(500)
          .setMessage("Internal server error")
          .build()
      )
  }
}

export const verifyEmailController = async (req, res) => {
  const { validation_token } = req.params
  const response = new ResponseBuilder()

  try {
    if (!validation_token) {
      return res
        .status(400)
        .json(
          response
            .setOk(false)
            .setStatus(400)
            .setMessage("Validation token is required")
            .build()
        )
    }

    const decoded = jwt.verify(validation_token, process.env.JWT_SECRET)

    const user = await User.findOne({ email: decoded.email })

    if (!user) {
      return res
        .status(404)
        .json(
          response
            .setOk(false)
            .setStatus(404)
            .setMessage("User not found")
            .build()
        )
    }

    if (user.emailVerified) {
      return res
        .status(400)
        .json(
          response
            .setOk(false)
            .setStatus(400)
            .setMessage("Email is already verified")
            .build()
        )
    }
    user.emailVerified = true
    await user.save()

    return res
      .status(200)
      .json(
        response
          .setOk(true)
          .setStatus(200)
          .setMessage("Email verified successfully")
          .build()
      )
  } catch (error) {
    console.error("Error in verifyEmailController:", error.message)
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json(
          response
            .setOk(false)
            .setStatus(401)
            .setMessage("Invalid or expired token")
            .build()
        )
    }
    return res
      .status(500)
      .json(
        response
          .setOk(false)
          .setStatus(500)
          .setMessage("Internal server error")
          .build()
      )
  }
}

export const sendRecoveryEmail = async (req, res) => {
  const { email } = req.body
  const response = new ResponseBuilder()

  try {
    if (!email) {
      return res
        .status(400)
        .json(
          response
            .setOk(false)
            .setStatus(400)
            .setMessage("Email is required")
            .build()
        )
    }

    const normalizedEmail = email.toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res
        .status(404)
        .json(
          response
            .setOk(false)
            .setStatus(404)
            .setMessage("User not found")
            .build()
        )
    }

    const resetToken = jwt.sign(
      { email: normalizedEmail },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    )

    user.resetPasswordToken = resetToken
    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/set-new-password?token=${resetToken}`

    await transportEmail.sendMail({
      subject: "Password Recovery",
      to: normalizedEmail,
      html: `
          <h1>Password Reset</h1>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetUrl}">Reset your password</a></p>
        `,
    })

    return res
      .status(200)
      .json(
        response
          .setOk(true)
          .setStatus(200)
          .setMessage("Password recovery email sent successfully")
          .build()
      )
  } catch (error) {
    console.error("Error in sendRecoveryEmail:", error.message)
    return res
      .status(500)
      .json(
        response.setOk(false).setStatus(500).setMessage("Server error").build()
      )
  }
}

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body
  const response = new ResponseBuilder()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({ email: decoded.email })

    if (!user) {
      return res
        .status(404)
        .json(
          response
            .setOk(false)
            .setStatus(404)
            .setMessage("User not found")
            .build()
        )
    }

    const hashedPassword = await hashPassword(password)

    user.password = hashedPassword
    await user.save()

    return res
      .status(200)
      .json(
        response
          .setOk(true)
          .setStatus(200)
          .setMessage("Password updated successfully")
          .build()
      )
  } catch (error) {
    console.error("Error in resetPasswordController:", error.message)
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json(
          response
            .setOk(false)
            .setStatus(401)
            .setMessage("Invalid or expired token")
            .build()
        )
    }
    return res
      .status(500)
      .json(
        response
          .setOk(false)
          .setStatus(500)
          .setMessage("Error resetting password")
          .build()
      )
  }
}
