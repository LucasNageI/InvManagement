import dotenv from "dotenv";

dotenv.config();

const ENVIRONMENT = {
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_USER: process.env.EMAIL_USER || "",
  JWT_SECRET:
    process.env.JWT_SECRET ||
    (() => {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    })(),
  FRONTEND_URL:
    process.env.FRONTEND_URL ||
    (() => {
      throw new Error("FRONTEND_URL is not defined in environment variables.");
    })(),
  MONGODB_DATABASE: process.env.MONGODB_DATABASE,
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
};

export default ENVIRONMENT;
