import mongoose from "mongoose"

const InventoryItemSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  state: { type: String, enum: ["Active", "Inactive"], required: true },
  category: { type: String, required: true },
})

const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema)

export default InventoryItem