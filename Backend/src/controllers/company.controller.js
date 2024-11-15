import jwt from "jsonwebtoken"
import crypto from "crypto"
import CompanyRepository from "../repositories/company.repositiry.js"
import { hashPassword } from "../helpers/auth.js"

export const createCompanyController = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(403).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const adminUser = decoded.email

    //secret business key (acceso para unirse a una company ya creada)
    const secretKey = crypto.randomBytes(16).toString("hex")

    const { businessEmail, businessPassword, businessName } = req.body

    if (!businessEmail || !businessPassword || !businessName) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos." })
    }

    const hashedPassword = await hashPassword(businessPassword)

    const companyData = {
      adminUser,
      secretKey,
      businessEmail,
      businessPassword: hashedPassword,
      businessName,
      inventory: [],
      employees: [],
    }

    const newCompany = await CompanyRepository.create(companyData)

    res
      .status(201)
      .json({ message: "Company created successfully", company: newCompany })
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
