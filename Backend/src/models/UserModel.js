import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
})

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User