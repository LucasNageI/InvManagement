import mongoose from "mongoose";
import ENVIRONMENT from "./environment.js";

const connectDB = async () => {
  try {
    console.log("MongoDB Connection String:", ENVIRONMENT.MONGODB_CONNECTION_STRING); // Verifica el valor
    await mongoose.connect(ENVIRONMENT.MONGODB_CONNECTION_STRING);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Salir si hay un error
  }
};

export default connectDB;