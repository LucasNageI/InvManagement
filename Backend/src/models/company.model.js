import mongoose from "mongoose"

const companySchema = new mongoose.Schema(
  {
    adminUser: {
      type: String,
      required: true,
    },
    secretKey: {
      type: String,
      required: true,
    },
    businessEmail: {
      type: String,
      required: true,
      unique: true,
    },
    businessPassword: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    inventory: {
      type: Array,
      default: [],
    },
    employees: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const Company = mongoose.model("Company", companySchema)

export default Company
