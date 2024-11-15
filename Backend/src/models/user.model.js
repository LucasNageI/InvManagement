import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
})

export default mongoose.model("User", userSchema)
