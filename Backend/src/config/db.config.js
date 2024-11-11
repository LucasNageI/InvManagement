import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/InvManagementDB'

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB - InvManagementDB')
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB', error)
  })