import express from "express"

import {
    createEmployeeController,
    updateEmployeeController,
    getEmployeesByCompany,
    deleteEmployeeController,
} from "../controllers/employees.controller.js"
import { authenticateToken } from "../middlewares/verifyToken.js"
import { verifyEmailVerified } from "../middlewares/verifyEmail.js"

const employeesRouter = express.Router()

employeesRouter.post("/:company_id/employees", authenticateToken, verifyEmailVerified, createEmployeeController)
employeesRouter.put("/:company_id/update-employee/:id", authenticateToken, verifyEmailVerified, updateEmployeeController)
employeesRouter.get("/:company_id/get-employees", authenticateToken, verifyEmailVerified, getEmployeesByCompany)
employeesRouter.delete("/:company_id/delete-employee/:id", authenticateToken, verifyEmailVerified, deleteEmployeeController)

export default employeesRouter