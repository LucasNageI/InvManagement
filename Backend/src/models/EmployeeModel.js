import mongoose from "mongoose"

const EmployeeSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  job: { type: String, required: true },
  salary: { type: Number, required: true },
  years_worked: { type: Number, required: true },
  state: { type: String, enum: ["Active", "Inactive"], required: true },
  company_id: {type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }
})

const Employee = mongoose.model("Employee", EmployeeSchema)

export default Employee