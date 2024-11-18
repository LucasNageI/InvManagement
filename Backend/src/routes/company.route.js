import express from "express"

import {
  verifyBusinessKeyController,
  getCompany,
  createCompanyController,
  getCompaniesByUserId,
  getUserData,
} from "../controllers/company.controller.js"
import { authenticateToken } from "../middlewares/verifyToken.js"
import { verifyEmailVerified } from "../middlewares/verifyEmail.js"

const companyRouter = express.Router()

companyRouter.post("/verify", authenticateToken, verifyEmailVerified, verifyBusinessKeyController)
companyRouter.get("/get-companies", authenticateToken, verifyEmailVerified, getCompaniesByUserId)
companyRouter.get("/get-user-profile", authenticateToken, verifyEmailVerified, getUserData)
companyRouter.post("/add-company",authenticateToken, verifyEmailVerified, createCompanyController)
companyRouter.get("/:company_id", authenticateToken, verifyEmailVerified, getCompany)

export default companyRouter