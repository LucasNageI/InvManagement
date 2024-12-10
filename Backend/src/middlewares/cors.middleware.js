import ENVIRONMENT from "../config/environment.js"

const customCorsMiddleware = (req, res, next) => {
  const origin = req.headers.origin
  const allowedOrigins = [ENVIRONMENT.FRONTEND_URL, "http://localhost:5173"]

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Credentials", "true")
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  )
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }
  next()
}

export default customCorsMiddleware