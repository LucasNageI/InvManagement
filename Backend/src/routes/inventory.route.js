import express from "express"

import {
  createInventoryItemController,
  updateInventoryController,
  getInventoryByCompany,
  deleteInventoryItemController,
} from "../controllers/inventory.controller.js"
import { authenticateToken } from "../middlewares/verifyToken.js"
import { verifyEmailVerified } from "../middlewares/verifyEmail.js"

const inventoryRouter = express.Router()

inventoryRouter.post("/:company_id/inventory", authenticateToken, verifyEmailVerified, createInventoryItemController)
inventoryRouter.put("/:company_id/update-inventory/:id", authenticateToken, verifyEmailVerified, updateInventoryController)
inventoryRouter.get("/:company_id/get-inventory", authenticateToken, verifyEmailVerified, getInventoryByCompany)
inventoryRouter.delete("/:company_id/delete-inventory-item/:id", authenticateToken, verifyEmailVerified, deleteInventoryItemController)

export default inventoryRouter