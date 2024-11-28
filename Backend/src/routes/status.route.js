import express from "express"

const router = express.Router()

router.post("/", (req, res) => {
  res.status(200).json({ message: "Server running successfully" })
})

export default router
