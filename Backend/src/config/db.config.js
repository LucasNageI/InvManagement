import mongoose from "mongoose"

const connectDB = async () => {
  mongoose
    .connect("mongodb://localhost:27017/InvManagementDB")
    .then(() => {
      console.log("MongoDB connected successfully!")
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err)
    })
}

export default connectDB
