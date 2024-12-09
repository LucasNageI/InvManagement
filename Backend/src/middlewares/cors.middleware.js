import { FRONTEND_URL } from "../config/environment.js"

export const customCorsMiddleware = (req, res, next) => {
  const origin = req.headers.origin
  const allowedOrigins = [FRONTEND_URL]

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  next()
}