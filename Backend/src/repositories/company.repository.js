import Company from "../models/CompanyModel.js"

class CompanyRepository {
  static async findByName(businessName) {
    try {
      return await Company.findOne({ businessName })
    } catch (error) {
      throw new Error("Failed searching company by name: " + error.message)
    }
  }

  static async findBySecretKey(secretKey) {
    try {
      return await Company.findOne({ secretKey })
    } catch (error) {
      throw new Error(
        "Failed searching company by secret key: " + error.message
      )
    }
  }

  static async findById(companyId) {
    try {
      return await Company.findById(companyId)
    } catch (error) {
      throw new Error("Failed to find company by ID: " + error.message)
    }
  }

  static async findCompaniesByUserId(userId) {
    try {
      return await Company.find({
        $or: [{ adminUser: userId }, { users: userId }],
      })
    } catch (error) {
      throw new Error("Failed to find companies by user ID: " + error.message)
    }
  }

  static async addUserToCompany(companyId, userId) {
    try {
      const company = await Company.findById(companyId)
      if (!company) throw new Error("Company not found")

      if (!company.users.includes(userId)) {
        company.users.push(userId)
        await company.save()
      }
      return company
    } catch (error) {
      throw new Error("Failed to add user to company: " + error.message)
    }
  }

  static async create(companyData) {
    try {
      const company = new Company(companyData)
      return await company.save()
    } catch (error) {
      throw new Error("Failed to create company: " + error.message)
    }
  }
}

export default CompanyRepository