import nodemailer from "nodemailer"
import ENVIRONMENT from "../config/environment.js"

export const transportEmail = nodemailer.createTransport({
  service: "gmail",
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: ENVIRONMENT.EMAIL_USER,
    pass: ENVIRONMENT.EMAIL_PASSWORD,
  },
})