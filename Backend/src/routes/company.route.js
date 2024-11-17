import express from "express"

import {
  getCompany,
  createCompanyController,
  getCompaniesByUserId,
  getUserData,
  createInventoryItemController,
  getInventoryItemsController,
  deleteInventoryItemController,
} from "../controllers/company.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const companyRouter = express.Router()

companyRouter.get("/get-companies", getCompaniesByUserId)
companyRouter.get("/get-user-profile", verifyToken, getUserData)
companyRouter.post("/add-company", createCompanyController)
companyRouter.get("/:company_id", getCompany)
companyRouter.post("/:company_id/inventory", createInventoryItemController)
companyRouter.get("/:company_id/get-inventory", getInventoryItemsController)
companyRouter.delete("/:company_id/delete-inventory-item/:id", deleteInventoryItemController)

export default companyRouter