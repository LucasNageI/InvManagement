import User from "../models/UserModel.js"

class UserRepository {
  static async findByEmail(email) {
    try {
      return await User.findOne({ email })
    } catch (error) {
      throw new Error("Failed searching user by email: " + error.message)
    }
  }

  static async updateUser(userId, updateData) {
    try {
      return await User.findByIdAndUpdate(userId, updateData, { new: true })
    } catch (error) {
      throw new Error("Failed to update user: " + error.message)
    }
  }

  static async createUser(userData) {
    try {
      const user = new User(userData)
      return await user.save()
    } catch (error) {
      throw new Error("Failed to create user: " + error.message)
    }
  }
  static async addCompanyToUser(userId, companyId) {
    try {
      const user = await User.findById(userId)
      if (!user) throw new Error("User not found")

      if (!user.companies.includes(companyId)) {
        user.companies.push(companyId)
        await user.save()
      }
      return user
    } catch (error) {
      throw new Error("Failed to add company to user: " + error.message)
    }
  }

  static async findById(userId) {
    try {
      return await User.findById(userId)
    } catch (error) {
      throw new Error("Failed to find user by ID: " + error.message)
    }
  }

  static async addCompanyToUser(userId, companyId) {
    try {
      const user = await User.findById(userId)
      if (!user) throw new Error("User not found")

      if (!user.companies.includes(companyId)) {
        user.companies.push(companyId)
        await user.save()
      }
      return user
    } catch (error) {
      throw new Error("Failed to add company to user: " + error.message)
    }
  }
}

export default UserRepository