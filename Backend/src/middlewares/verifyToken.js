import jwt from "jsonwebtoken"
import ResponseBuilder from "../helpers/builders/responseBuilder.js"

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  const responseBuilder = new ResponseBuilder()

  if (!token) {
    return res.status(401).json(responseBuilder
          .setOk(false)
          .setMessage("Token not provided")
          .setCode("TOKEN_NOT_PROVIDED")
          .build()
      )
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json(responseBuilder
            .setOk(false)
            .setMessage("Invalid token")
            .setCode("INVALID_TOKEN")
            .build()
        )
    }

    req.user = user
    next()
  })
}