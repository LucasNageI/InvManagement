import express from "express"

import { createCompanyController } from "../controllers/company.controller.js"

const authRouter = express.Router()

authRouter.post("/add-company", createCompanyController)

export default authRouter
