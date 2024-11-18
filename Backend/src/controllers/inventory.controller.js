import InventoryItem from "../models/InventoryModel.js"
import Company from "../models/CompanyModel.js"
import ResponseBuilder from "../helpers/builders/responseBuilder.js"

export const createInventoryItemController = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  try {
    const { product_name, price, stock, state, category, company_id } = req.body

    if (
      !product_name ||
      !price ||
      !stock ||
      !state ||
      !category ||
      !company_id
    ) {
      return res.status(400).json(responseBuilder
          .setOk(false)
          .setMessage("All fields are required.")
          .setCode("MISSING_FIELDS")
          .build()
      )
    }

    const company = await Company.findById(company_id)
    if (!company) {
      return res.status(404).json(responseBuilder
          .setOk(false)
          .setMessage("Company not found.")
          .setCode("COMPANY_NOT_FOUND")
          .build()
      )
    }

    const newInventoryItem = new InventoryItem({
      product_name,
      price,
      stock,
      state,
      category,
      company_id,
    })

    const savedItem = await newInventoryItem.save()

    company.inventory.push(savedItem._id)
    await company.save()

    return res.status(201).json(responseBuilder
        .setOk(true)
        .setMessage("Inventory item created successfully.")
        .setData(savedItem)
        .setCode("ITEM_CREATED")
        .build()
    )
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return res.status(500).json(responseBuilder
        .setOk(false)
        .setMessage("Failed to create inventory item.")
        .setCode("SERVER_ERROR")
        .build()
    )
  }
}

export const updateInventoryController = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  try {
    const { company_id, id } = req.params
    const { product_name, price, stock, state, category } = req.body

    if (
      !product_name ||
      !price ||
      !stock ||
      !state ||
      !category ||
      !company_id
    ) {
      return res.status(400).json(responseBuilder
          .setOk(false)
          .setMessage("All fields are required.")
          .setCode("MISSING_FIELDS")
          .build()
      )
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json(responseBuilder
          .setOk(false)
          .setMessage("Price and stock must be positive numbers.")
          .setCode("INVALID_FIELDS")
          .build()
      )
    }

    if (!["Active", "Inactive"].includes(state)) {
      return res.status(400).json(responseBuilder
          .setOk(false)
          .setMessage("State must be either 'Active' or 'Inactive'.")
          .setCode("INVALID_STATE")
          .build()
      )
    }

    const updatedInventoryItem = await InventoryItem.findByIdAndUpdate(
      id,
      { product_name, price, stock, state, category, company_id },
      { new: true, runValidators: true }
    )

    if (!updatedInventoryItem) {
      return res.status(404).json(responseBuilder
          .setOk(false)

          .setMessage("Inventory item not found.")
          .setCode("ITEM_NOT_FOUND")
          .build()
      )
    }

    return res.status(200).json(responseBuilder
        .setOk(true)
        .setMessage("Inventory item updated successfully.")
        .setData(updatedInventoryItem)
        .setCode("ITEM_UPDATED")
        .build()
    )
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return res.status(500).json(responseBuilder
        .setOk(false)
        .setMessage("Failed to update inventory item.")
        .setCode("SERVER_ERROR")
        .build()
    )
  }
}

export const getInventoryByCompany = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  const { company_id } = req.params

  try {
    const inventoryItems = await InventoryItem.find({ company_id })

    if (!inventoryItems || inventoryItems.length === 0) {
      return res.status(404).json(responseBuilder
          .setOk(false)
          .setMessage("No inventory items found for this company.")
          .setCode("NO_ITEMS_FOUND")
          .build()
      )
    }

    return res.status(200).json(responseBuilder
        .setOk(true)
        .setData(inventoryItems)
        .setCode("ITEMS_FOUND")
        .build()
    )
  } catch (error) {
    console.error("Error fetching inventory items:", error)
    return res.status(500).json(responseBuilder
        .setOk(false)
        .setMessage("Failed to fetch inventory items.")
        .setCode("SERVER_ERROR")
        .build()
    )
  }
}

export const deleteInventoryItemController = async (req, res) => {
  const responseBuilder = new ResponseBuilder()
  try {
    const { id } = req.params

    const deletedItem = await InventoryItem.findByIdAndDelete(id)

    if (!deletedItem) {
      return res.status(404).json(responseBuilder
          .setOk(false)
          .setMessage("Product not found.")
          .setCode("ITEM_NOT_FOUND")
          .build()
      )
    }

    return res.status(200).json(responseBuilder
        .setOk(true)
        .setMessage("Product deleted successfully.")
        .setCode("ITEM_DELETED")
        .build()
    )
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return res.status(500).json(responseBuilder
        .setOk(false)
        .setMessage("Failed to delete inventory item.")
        .setCode("SERVER_ERROR")
        .build()
    )
  }
}