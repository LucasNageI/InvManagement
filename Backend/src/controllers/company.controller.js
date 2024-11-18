import jwt from "jsonwebtoken"
import crypto from "crypto"
import CompanyRepository from "../repositories/company.repository.js"
import User from "../models/UserModel.js"
import Company from "../models/CompanyModel.js"
import { comparePasswords } from "../helpers/auth.js"
import mongoose from "mongoose"
import ResponseBuilder from "../helpers/builders/responseBuilder.js"

export const verifyBusinessKeyController = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  const { business_key } = req.body

  try {
    const userId = req.user.userId
    const company = await Company.findOne({ secretKey: business_key })

    if (!company) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setMessage("Invalid business key")
            .setCode("INVALID_KEY")
            .build()
        )
    }

    if (!company.users.includes(userId)) {
      company.users.push(userId)
      await company.save()
    }

    const user = await User.findById(userId)
    if (!user.companies.includes(company._id)) {
      user.companies.push(company._id)
      await user.save()
    }

    return res.status(200).json(responseBuilder
          .setOk(true)
          .setMessage("User added to company")
          .setData({ companyId: company._id })
          .setCode("USER_ADDED")
          .build()
      )
  } catch (error) {
    console.error("Error adding user to company:", error)
    return res.status(500).json(responseBuilder
          .setOk(false)
          .setMessage("Something went wrong")
          .setCode("SERVER_ERROR")
          .build()
      )
  }
}

export const createCompanyController = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  const token = req.headers.authorization?.split(" ")[1]
  console.log("token ", token)
  try {

    if (!token) {
      return res.status(403).json(responseBuilder
            .setOk(false)
            .setMessage("No token provided")
            .setCode("NO_TOKEN")
            .build()
        )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const adminUserEmail = decoded.email

    const user = await User.findOne({ email: adminUserEmail })
    if (!user) {
      return res.status(404).json(responseBuilder
            .setOk(false)
            .setMessage("User not found")
            .setCode("USER_NOT_FOUND")
            .build()
        )
    }

    const { password, businessName } = req.body

    if (!password) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setMessage("Password is required")
            .setCode("MISSING_PASSWORD")
            .build()
        )
    }

    if (!businessName) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setMessage("Business name is required")
            .setCode("MISSING_BUSINESS_NAME")
            .build()
        )
    }

    const existingCompany = await CompanyRepository.findByName(businessName)
    if (existingCompany) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setMessage("A company with this name already exists")
            .setCode("COMPANY_EXISTS")
            .build()
        )
    }

    const isPasswordValid = await comparePasswords(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json(responseBuilder
            .setOk(false)
            .setMessage("Invalid password")
            .setCode("INVALID_PASSWORD")
            .build()
        )
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

    return res.status(201).json(responseBuilder
          .setOk(true)
          .setMessage("Company created successfully")
          .setData({ company: newCompany })
          .setCode("COMPANY_CREATED")
          .build()
      )
  } catch (error) {
    console.error(error)
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json(responseBuilder
            .setOk(false)
            .setMessage("Invalid or expired token")
            .setCode("INVALID_OR_EXPIRED_TOKEN")
            .build()
        )
    }
    return res.status(500).json(responseBuilder
          .setOk(false)
          .setMessage("Server error")
          .setCode("SERVER_ERROR")
          .build()
      )
  }
}

export const getCompaniesByUserId = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  try {
    const authHeader = req.headers["authorization"]
    if (!authHeader) {
      return res.status(401).json(responseBuilder
            .setOk(false)
            .setMessage("Token not provided")
            .setCode("TOKEN_NOT_PROVIDED")
            .build()
        )
    }

    const validation_token = authHeader.split(" ")[1]
    if (!validation_token) {
      return res.status(401).json(responseBuilder
            .setOk(false)
            .setMessage("Invalid token")
            .setCode("INVALID_TOKEN")
            .build()
        )
    }

    const decoded = jwt.verify(validation_token, process.env.JWT_SECRET)
    if (!decoded || !decoded.userId) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setMessage("Invalid token or user ID")
            .setCode("INVALID_TOKEN_OR_USER_ID")
            .build()
        )
    }

    const userId = decoded.userId

    const userCompanies = await Company.find({
      $or: [
        { adminUser: userId },
        { users: userId },
      ],
    })

    if (userCompanies.length === 0) {
      return res.status(404).json(responseBuilder
            .setOk(false)
            .setMessage("No companies found")
            .setCode("NO_COMPANIES_FOUND")
            .build()
        )
    }

    return res.status(200).json(responseBuilder
          .setOk(true)
          .setData(userCompanies)
          .setCode("USER_COMPANIES_FOUND")
          .build()
      )
  } catch (error) {
    console.error("Failed to search companies:", error.message)
    return res.status(500).json(responseBuilder
          .setOk(false)
          .setMessage("Failed to search companies")
          .setCode("COMPANY_SEARCH_ERROR")
          .setData({ error: error.message })
          .build()
      )
  }
}

export const getUserData = async (req, res) => {
  const responseBuilder = new ResponseBuilder()

  try {
    const userId = req.user?.userId
    if (!userId) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setMessage("User ID not found")
            .setCode("USER_ID_NOT_FOUND")
            .build()
        )
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json(responseBuilder
            .setOk(false)
            .setMessage("User not found")
            .setCode("USER_NOT_FOUND")
            .build()
        )
    }

    return res.status(200).json(responseBuilder
          .setOk(true)
          .setData(user)
          .setCode("USER_DATA_FOUND")
          .build()
      )
  } catch (error) {
    console.error(error)
    return res.status(500).json(responseBuilder
          .setOk(false)
          .setMessage("Failed to get user data")
          .setCode("USER_DATA_ERROR")
          .setData({ error: error.message })
          .build()
      )
  }
}

export const getCompany = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  try {
    const { company_id } = req.params
    const cleanCompanyId = company_id.trim()

    if (!mongoose.Types.ObjectId.isValid(cleanCompanyId)) {
      return res.status(400).json(responseBuilder
            .setOk(false)
            .setMessage("Invalid company ID")
            .setCode("INVALID_COMPANY_ID")
            .build()
        )
    }

    const company = await Company.findById(cleanCompanyId)
    if (!company) {
      return res.status(404).json(responseBuilder
            .setOk(false)
            .setMessage("Company not found")
            .setCode("COMPANY_NOT_FOUND")
            .build()
        )
    }

    return res.status(200).json(responseBuilder
          .setOk(true)
          .setData(company)
          .setCode("COMPANY_FOUND")
          .build()
      )
  } catch (error) {
    console.error("Error fetching company:", error)

    return res.status(500).json(responseBuilder
          .setOk(false)
          .setMessage("An unexpected error occurred")
          .setCode("UNEXPECTED_ERROR")
          .build()
      )
  }
}