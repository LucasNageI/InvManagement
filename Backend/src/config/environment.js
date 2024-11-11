import dotenv from 'dotenv'

dotenv.config()

const ENVIRONMENT = {
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    EMAIL_USER: process.env.EMAIL_USER || '',
    SECRET_KEY: process.env.SECRET_KEY || (() => {
        throw new Error("SECRET_KEY is not defined in environment variables.")
    })(),
    FRONTEND_URL: process.env.FRONTEND_URL || (() => {
        throw new Error("FRONTEND_URL is not defined in environment variables.")
    })(),
}

export default ENVIRONMENT
