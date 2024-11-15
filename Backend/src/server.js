import express from "express"
import statusRouter from "./routes/status.route.js"
import authRouter from "./routes/auth.route.js"
import companyRouter from "./routes/company.route.js"
import connectDB from "./config/db.config.js"
import cors from "cors"
import dotenv from "dotenv"
import ENVIRONMENT from "./config/environment.js"

dotenv.config()

const PORT = process.env.PORT || 5000 

const app = express()

connectDB()

const corsOptions = {
  origin: ENVIRONMENT.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))

app.use(express.json())

app.use("/api/status", statusRouter)
app.use("/api/auth", authRouter)
app.use("/api/companies", companyRouter)

app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res
    .status(err.status || 500)
    .json({ error: err.message || "Error intenrno del servidor" })
})

app.listen(PORT, () => {
  console.log(`El servidor se está ejecutando en http://localhost:${PORT}`)
})
