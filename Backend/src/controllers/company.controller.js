import jwt from "jsonwebtoken"
import crypto from "crypto"
import CompanyRepository from "../repositories/company.repositiry.js"
import User from "../models/UserModel.js"
import Company from "../models/CompanyModel.js"
import InventoryItem from "../models/InventoryModel.js"
import Employee from "../models/EmployeeModel.js"
import { comparePasswords } from "../helpers/auth.js"
import mongoose from "mongoose"

export const createCompanyController = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(403).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const adminUserEmail = decoded.email

    const user = await User.findOne({ email: adminUserEmail })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { password, businessName } = req.body

    if (!password) {
      return res.status(400).json({ message: "Password is required" })
    }

    if (!businessName) {
      return res.status(400).json({ message: "Business name is required" })
    }

    const existingCompany = await CompanyRepository.findByName(businessName)
    if (existingCompany) {
      return res
        .status(400)
        .json({ message: "A company with this name already exists" })
    }

    const isPasswordValid = await comparePasswords(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const generatedSecretKey = crypto.randomBytes(16).toString("hex")

    const companyData = {
      createdAt: new Date(),
      adminUser: user._id,
      secretKey: generatedSecretKey,
      businessName: businessName,
      inventory: [],
      employees: [],
      users: [],
    }

    const newCompany = await CompanyRepository.create(companyData)

    return res.status(201).json({
      message: "Company created successfully",
      company: newCompany,
    })
  } catch (error) {
    console.error(error)
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Token no válido o expirado" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

export const getCompaniesByUserId = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"]
    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: "Token no proporcionado",
      })
    }

    const validation_token = authHeader.split(" ")[1]
    if (!validation_token) {
      return res.status(401).json({
        ok: false,
        message: "Token inválido",
      })
    }

    const decoded = jwt.verify(validation_token, process.env.JWT_SECRET)
    if (!decoded || !decoded.userId) {
      return res.status(400).json({
        ok: false,
        message: "Token inválido o no contiene un userId",
      })
    }

    const userId = decoded.userId

    const userCompanies = await Company.find({ adminUser: userId })

    if (userCompanies.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No se encontraron compañías asociadas al usuario",
      })
    }

    return res.status(200).json({
      ok: true,
      data: userCompanies,
    })
  } catch (error) {
    console.error("Error al buscar compañías:", error.message)
    return res.status(500).json({
      ok: false,
      message: "Error al buscar compañías",
      error: error.message,
    })
  }
}

export const getUserData = async (req, res) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return res.status(400).json({ message: "ID de usuario no encontrado" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error al obtener los datos del usuario",
      error: error.message,
    })
  }
}

export const getCompany = async (req, res) => {
  try {
    const { company_id } = req.params
    const cleanCompanyId = company_id.trim()

    if (!mongoose.Types.ObjectId.isValid(cleanCompanyId)) {
      return res.status(400).json({ error: "Invalid company ID" })
    }

    const company = await Company.findById(cleanCompanyId)
    if (!company) {
      return res.status(404).json({ error: "Company not found" })
    }

    res.status(200).json(company)
  } catch (error) {
    console.error("Error fetching company:", error)
    res.status(500).json({ error: "An unexpected error occurred" })
  }
}

export const createInventoryItemController = async (req, res) => {
  try {
    const { product_name, price, stock, state, category } = req.body

    if (!product_name || !price || !stock || !state || !category) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const newInventoryItem = new InventoryItem({
      product_name,
      price,
      stock,
      state,
      category,
    })

    const savedItem = await newInventoryItem.save()

    res.status(201).json(savedItem)
  } catch (error) {
    console.error("Error creating inventory item:", error)
    res.status(500).json({ message: "Failed to create inventory item." })
  }
}

export const updateInventoryController = async (req, res) => {
  try {
    const { id } = req.params // ID del producto a actualizar
    const { product_name, price, stock, state, category } = req.body

    // Validación de campos requeridos
    if (!product_name || !price || !stock || !state || !category) {
      return res.status(400).json({ message: "All fields are required." })
    }

    // Validar que los números sean positivos
    if (price < 0 || stock < 0) {
      return res
        .status(400)
        .json({ message: "Price and stock must be positive numbers." })
    }

    // Validar estado
    if (!["Active", "Inactive"].includes(state)) {
      return res
        .status(400)
        .json({ message: "State must be either 'Active' or 'Inactive'." })
    }

    // Actualizar el producto
    const updatedInventoryItem = await InventoryItem.findByIdAndUpdate(
      id,
      { product_name, price, stock, state, category },
      { new: true, runValidators: true } // `new: true` devuelve el documento actualizado
    )

    if (!updatedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found." })
    }

    res.status(200).json(updatedInventoryItem)
  } catch (error) {
    console.error("Error updating inventory item:", error)
    res.status(500).json({ message: "Failed to update inventory item." })
  }
}

export const getInventoryItemsController = async (req, res) => {
  try {
    const products = await InventoryItem.find()
    res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Failed to fetch products." })
  }
}
export const deleteInventoryItemController = async (req, res) => {
  try {
    const { id } = req.params

    const deletedItem = await InventoryItem.findByIdAndDelete(id)

    if (!deletedItem) {
      return res.status(404).json({ message: "Product not found." })
    }

    res.status(200).json({ message: "Product deleted successfully." })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    res.status(500).json({ message: "Failed to delete inventory item." })
  }
}
export const createEmployeeController = async (req, res) => {
  try {
    const { full_name, job, salary, years_worked, state } = req.body

    // Validar que todos los campos estén presentes.
    if (!full_name || !job || !salary || !years_worked || !state) {
      return res.status(400).json({ message: "All fields are required." })
    }

    // Crear el nuevo empleado.
    const newEmployee = new Employee({
      full_name,
      job,
      salary,
      years_worked,
      state,
    })

    // Guardar el empleado en la base de datos.
    const savedEmployee = await newEmployee.save()

    res.status(201).json(savedEmployee)
  } catch (error) {
    console.error("Error creating employee:", error)
    res.status(500).json({ message: "Failed to create employee." })
  }
}

export const updateEmployeeController = async (req, res) => {
  try {
    const { id } = req.params // ID del empleado a actualizar
    const { full_name, job, salary, years_worked, state } = req.body

    // Validación de campos requeridos
    if (!full_name || !job || !salary || !years_worked || !state) {
      return res.status(400).json({ message: "All fields are required." })
    }

    // Validar que los números sean positivos
    if (salary < 0 || years_worked < 0) {
      return res
        .status(400)
        .json({ message: "Salary and years worked must be positive numbers." })
    }

    // Actualizar el empleado
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { full_name, job, salary, years_worked, state },
      { new: true, runValidators: true } // `new: true` devuelve el documento actualizado
    )

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." })
    }

    res.status(200).json(updatedEmployee)
  } catch (error) {
    console.error("Error updating employee:", error)
    res.status(500).json({ message: "Failed to update employee." })
  }
}

export const getEmployeesController = async (req, res) => {
  try {
    // Obtener todos los empleados de la base de datos.
    const employees = await Employee.find()

    res.status(200).json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    res.status(500).json({ message: "Failed to fetch employees." })
  }
}

export const deleteEmployeeController = async (req, res) => {
  try {
    const { id } = req.params

    // Buscar y eliminar el empleado por su ID.
    const deletedEmployee = await Employee.findByIdAndDelete(id)

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found." })
    }

    res.status(200).json({ message: "Employee deleted successfully." })
  } catch (error) {
    console.error("Error deleting employee:", error)
    res.status(500).json({ message: "Failed to delete employee." })
  }
}