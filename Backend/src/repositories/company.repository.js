import Company from "../models/CompanyModel.js";

class CompanyRepository {
  static async findByName(businessName) {
    try {
      return await Company.findOne({ businessName });
    } catch (error) {
      throw new Error("Failed searching company by name: " + error.message);
    }
  }

  static async create(companyData) {
    try {
      const company = new Company(companyData);
      return await company.save();
    } catch (error) {
      throw new Error("Failed to create company: " + error.message);
    }
  }
}

export default CompanyRepository;
