import express from "express"

import {
  getCompany,
  createCompanyController,
  getCompaniesByUserId,
  getUserData,
  createInventoryItemController,
  updateInventoryController,
  getInventoryItemsController,
  deleteInventoryItemController,
  createEmployeeController,
  updateEmployeeController,
  getEmployeesController,
  deleteEmployeeController
} from "../controllers/company.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const companyRouter = express.Router()

companyRouter.get("/get-companies", getCompaniesByUserId)
companyRouter.get("/get-user-profile", verifyToken, getUserData)
companyRouter.post("/add-company", createCompanyController)
companyRouter.get("/:company_id", getCompany)

companyRouter.post("/:company_id/inventory", createInventoryItemController)
companyRouter.put("/:company_id/update-inventory/:id", updateInventoryController)
companyRouter.get("/:company_id/get-inventory", getInventoryItemsController)
companyRouter.delete("/:company_id/delete-inventory-item/:id", deleteInventoryItemController)

companyRouter.post("/:company_id/employees", createEmployeeController)
companyRouter.put("/:company_id/update-employee/:id", updateEmployeeController)
companyRouter.get("/:company_id/get-employees", getEmployeesController)
companyRouter.delete("/:company_id/delete-employee/:id", deleteEmployeeController)

export default companyRouter