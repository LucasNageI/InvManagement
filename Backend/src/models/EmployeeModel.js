import mongoose from "mongoose"

const EmployeeSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  job: { type: String, required: true },
  salary: { type: Number, required: true, min: 0 },
  years_worked: { type: Number, required: true, min: 0 },
  state: { type: String, enum: ["Active", "Inactive"], required: true },
})

const Employee = mongoose.model("Employee", EmployeeSchema)

export default Employee