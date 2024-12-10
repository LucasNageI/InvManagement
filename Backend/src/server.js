import express from "express"
import dotenv from "dotenv"

import statusRouter from "./routes/status.route.js"
import authRouter from "./routes/auth.route.js"
import companyRouter from "./routes/company.route.js"
import inventoryRouter from "./routes/inventory.route.js"
import employeesRouter from "./routes/employees.route.js"
import connectDB from "./config/db.config.js"
import ENVIRONMENT from "./config/environment.js"
import customCorsMiddleware from "./middlewares/cors.middleware.js"

dotenv.config()

const app = express()

connectDB()

app.use(customCorsMiddleware)
app.use(express.json())

app.use("/api/status", statusRouter)
app.use("/api/auth", authRouter)
app.use("/api/companies", companyRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/employees", employeesRouter)

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found route" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server running successfully`)
})