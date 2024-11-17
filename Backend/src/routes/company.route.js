import express from "express"

import {
  getCompany,
  createCompanyController,
  getCompaniesByUserId,
  getUserData,
  createInventoryItemController,
  deleteInventoryItemController,
} from "../controllers/company.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const companyRouter = express.Router()

companyRouter.get("/get-companies", getCompaniesByUserId)
companyRouter.get("/get-user-profile", verifyToken, getUserData)
companyRouter.post("/add-company", createCompanyController)
companyRouter.get("/:company_id", getCompany)
companyRouter.post("/:company_id/inventory", createInventoryItemController)
companyRouter.delete(
  "/:company_id/inventory/:item_id",
  verifyToken,
  deleteInventoryItemController
)

export default companyRouter