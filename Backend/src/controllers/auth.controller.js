import { hashPassword, comparePasswords, generateToken } from "../helpers/auth.js"
  import { transportEmail } from "../helpers/transportEmail.js"
  import ResponseBuilder from "../helpers/builders/responseBuilder.js"
  import { emailVerification, verifyString, verifyMinLength } from "../helpers/validations.js"
  import UserRepository from "../repositories/user.repository.js"
  import jwt from "jsonwebtoken"
  import ENVIRONMENT from "../config/environment.js"
  
  export const registerController = async (req, res) => {
    const responseBuilder = new ResponseBuilder()
    try {
      const { username, email, password } = req.body
  
      if (!username || !email || !password) {
        return res.status(400).json(responseBuilder
              .setOk(false)
              .setCode("MISSING_FIELDS")
              .setMessage("All fields are required.")
              .build()
          )
      }
  
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
  
      let hasErrors = false
  
      for (let field_name in registerConfig) {
        for (let registerValidation of registerConfig[field_name].validation) {
          const result = registerValidation(
            field_name,
            registerConfig[field_name].value
          )
  
          if (result) {
            hasErrors = true
            registerConfig[field_name].errors.push(result)
          }
        }
      }
  
      if (hasErrors) {
        return res.status(400).json(responseBuilder
              .setOk(false)
              .setData({ registerState: registerConfig })
              .setCode("VALIDATION_ERROR")
              .build()
          )
      }
  
      const existingUser = await UserRepository.findByEmail(email)
  
      if (existingUser) {
        return res.status(409).json(responseBuilder
              .setOk(false)
              .setCode("EMAIL_ALREADY_REGISTERED")
              .setMessage("Email is already registered.")
              .build()
          )
      }
  
      const hashedPassword = await hashPassword(password)
  
      const normalizedEmail = email.toLowerCase()
  
      const validationToken = generateToken({ email: normalizedEmail })
  
      const redirectUrl = `${ENVIRONMENT.FRONTEND_URL}/email-verified?validation_token=${validationToken}`
  
      await transportEmail.sendMail({
        subject: "Validate your email",
        to: normalizedEmail,
        html: `
            <!DOCTYPE html>
            <html>
            <body>
              <h1>Validate your email</h1>
              <p>Click the link below to validate your email:</p>
              <p><a href="${redirectUrl}" style="color: blue text-decoration: underline">Validate your email</a></p>
            </body>
            </html>
          `,
      })
  
      const newUser = await UserRepository.createUser({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        verificationToken: validationToken,
    })
    
    return res.status(201).json(responseBuilder
        .setOk(true)
        .setCode("SUCCESS")
        .setData({
            message: "User registered successfully",
            user: {
                username: newUser.username,
                email: newUser.email,
            },
        })
        .build()
    )
    } catch (error) {
      console.error("Error during registration:", error)
  
      return res.status(500).json(responseBuilder
            .setOk(false)
            .setCode("INTERNAL_SERVER_ERROR")
            .setMessage("Internal server error")
            .setData({
              detail: error.message,
            })
            .build()
        )
    }
  }
  
  export const loginController = async (req, res) => {
    const { email, password } = req.body
    const responseBuilder = new ResponseBuilder()
  
    try {
      const user = await UserRepository.findByEmail(email)
  
      if (!user) {
        return res.status(400).json(
            responseBuilder
              .setOk(false)
              .setCode("USER_NOT_FOUND")
              .setMessage("User not found")
              .build()
          )
      }
  
      const isPasswordCorrect = await comparePasswords(password, user.password)
  
      if (!isPasswordCorrect) {
        return res.status(400).json(responseBuilder
              .setOk(false)
              .setCode("INVALID_CREDENTIALS")
              .setMessage("Invalid credentials")
              .build()
          )
      }
  
      if (!user.emailVerified) {
        return res.status(400).json(responseBuilder
              .setOk(false)
              .setCode("EMAIL_NOT_VERIFIED")
              .setMessage("Please verify your email before logging in")
              .build()
          )
      }
  
      const token = generateToken({ userId: user._id, email: user.email })
  
      return res.status(200).json(responseBuilder
            .setOk(true)
            .setCode("SUCCESS")
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
      return res.status(500).json(responseBuilder
            .setOk(false)
            .setCode("SERVER_ERROR")
            .setMessage("Server error")
            .build()
        )
    }
  }

  export const resendVerificationEmailController = async (req, res) => {
    const { email } = req.body
    const responseBuilder = new ResponseBuilder()
  
    try {
      if (!email) {
        return res.status(400).json(responseBuilder
              .setOk(false)
              .setCode("EMAIL_REQUIRED")
              .setMessage("Email is required")
              .build()
          )
      }
  
      const normalizedEmail = email.toLowerCase()
      const user = await UserRepository.findByEmail(normalizedEmail)
  
      if (!user) {
        return res.status(404).json(responseBuilder
              .setOk(false)
              .setCode("USER_NOT_FOUND")
              .setMessage("User not found")
              .build()
          )
      }
  
      if (user.emailVerified) {
        return res.status(400).json(
            responseBuilder
              .setOk(false)
              .setCode("EMAIL_ALREADY_VERIFIED")
              .setMessage("Email is already verified")
              .build()
          )
      }
  
      const validationToken = jwt.sign(
        { email: normalizedEmail },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      )
  
      await UserRepository.updateUser(user._id, {
        verificationToken: validationToken,
      })
  
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
  
      return res.status(200).json(responseBuilder
            .setOk(true)
            .setCode("VERIFICATION_EMAIL_RESENT")
            .setMessage("Verification email resent successfully")
            .build()
        )
    } catch (error) {
      console.error("Error in resendVerificationEmailController:", error.message)
      return res.status(500).json(responseBuilder
            .setOk(false)
            .setCode("INTERNAL_SERVER_ERROR")
            .setMessage("Internal server error")
            .build()
        )
    }
  }

export const verifyEmailController = async (req, res) => {
  const { validation_token } = req.params
  const responseBuilder = new ResponseBuilder()

  try {
    if (!validation_token) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setCode("VALIDATION_TOKEN_REQUIRED")
            .setMessage("Validation token is required")
            .build()
        )
    }

    const decoded = jwt.verify(validation_token, process.env.JWT_SECRET)

    const user = await UserRepository.findByEmail(decoded.email)

    if (!user) {
      return res.status(404).json(responseBuilder
            .setOk(false)
            .setCode("USER_NOT_FOUND")
            .setMessage("User not found")
            .build()
        )
    }

    if (user.emailVerified) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setCode("EMAIL_ALREADY_VERIFIED")
            .setMessage("Email is already verified")
            .build()
        )
    }

    await UserRepository.updateUser(user._id, { emailVerified: true })

    return res.status(200).json( responseBuilder
          .setOk(true)
          .setCode("EMAIL_VERIFIED")
          .setMessage("Email verified successfully")
          .build()
      )
  } catch (error) {
    console.error("Error in verifyEmailController:", error.message)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json( responseBuilder
            .setOk(false)
            .setCode("INVALID_TOKEN")
            .setMessage("Invalid or expired token")
            .build()
        )
    }

    return res.status(500).json(responseBuilder
          .setOk(false)
          .setCode("INTERNAL_SERVER_ERROR")
          .setMessage("Internal server error")
          .build()
      )
  }
}

export const sendRecoveryEmail = async (req, res) => {
    const { email } = req.body
    const responseBuilder = new ResponseBuilder()
  
    try {
      if (!email) {
        return res.status(400).json(responseBuilder
              .setOk(false)
              .setCode("EMAIL_REQUIRED")
              .setMessage("Email is required")
              .build()
          )
      }
  
      const normalizedEmail = email.toLowerCase()
      const user = await UserRepository.findByEmail(normalizedEmail)
  
      if (!user) {
        return res.status(404).json(responseBuilder
              .setOk(false)
              .setCode("USER_NOT_FOUND")
              .setMessage("User not found")
              .build()
          )
      }
  
      const resetToken = jwt.sign(
        { email: normalizedEmail },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      )
  
      await UserRepository.updateUser(user._id, { resetPasswordToken: resetToken })
  
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
  
      return res.status(200).json( responseBuilder
            .setOk(true)
            .setCode("EMAIL_SENT")
            .setMessage("Password recovery email sent successfully")
            .build()
        )
    } catch (error) {
      console.error("Error in sendRecoveryEmail:", error.message)
  
      return res.status(500).json( responseBuilder
            .setOk(false)
            .setCode("SERVER_ERROR")
            .setMessage("Server error")
            .build()
        )
    }
  }

  export const resetPasswordController = async (req, res) => {
    const { token, password } = req.body
    const responseBuilder = new ResponseBuilder()
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
  
      const user = await UserRepository.findByEmail(decoded.email)
  
      if (!user) {
        return res.status(404).json(responseBuilder
              .setOk(false)
              .setCode("USER_NOT_FOUND")
              .setMessage("User not found")
              .build()
          )
      }
  
      const hashedPassword = await hashPassword(password)
  
      await UserRepository.updateUser(user._id, { password: hashedPassword })
  
      return res.status(200).json(responseBuilder
            .setOk(true)
            .setCode("PASSWORD_UPDATED")
            .setMessage("Password updated successfully")
            .build()
        )
    } catch (error) {
      console.error("Error in resetPasswordController:", error.message)
  
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json(responseBuilder
              .setOk(false)
              .setCode("INVALID_TOKEN")
              .setMessage("Invalid or expired token")
              .build()
          )
      }
  
      return res.status(500).json(responseBuilder
            .setOk(false)
            .setCode("SERVER_ERROR")
            .setMessage("Error resetting password")
            .build()
        )
    }
  }  