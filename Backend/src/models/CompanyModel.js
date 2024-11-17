import mongoose from "mongoose"

const companySchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    adminUser: {
      type: String,
      required: true,
    },
    users: {
      type: Array,
      default: [],
    },
    secretKey: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    inventory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InventoryItem",
      },
    ],
    employees: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const Company = mongoose.model("Company", companySchema)

export default Company