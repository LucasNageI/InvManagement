const customCorsMiddleware = (req, res, next) => {
    const origin = req.headers.origin
    const allowedOrigins = [
      ENVIRONMENT.FRONTEND_URL,
      "http://localhost:5173",
      "https://frontend-invmanagement-itwo82fwd-lucas-nagels-projects.vercel.app",
    ]
  
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin)
      res.setHeader("Access-Control-Allow-Credentials", "true")
    }
  
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept"
    )
  
    if (req.method === "OPTIONS") {
      return res.sendStatus(204)
    }
  
    next()
  }
  
  export default customCorsMiddleware