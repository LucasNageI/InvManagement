import React from "react"
import { isPositiveNumber, usernameVerification } from "../../utils"

const InventoryList = ({
  inventoryItems,
  searchQuery,
  setInventoryItems,
  authToken,
  company_id,
  editingItem,
  setEditingItem,
  setErrorClass,
  setErrorMessage,
  isAdmin,
}) => {

  const handleEdit = (item) => {
    setEditingItem(item)
    setErrorClass("no-error")
    setErrorMessage("")
  }

  const handleUpdate = async (e) => {
    const updatedItem = {
      product_name: e.target.product_name.value,
      price: e.target.price.value,
      stock: e.target.stock.value,
      category: e.target.category.value,
      state: e.target.state.value,
    }

    if (
      !usernameVerification(updatedItem.product_name) ||
      !isPositiveNumber(updatedItem.price) ||
      !isPositiveNumber(updatedItem.stock)
    ) {
      setErrorClass("form-error")
      setErrorMessage("Invalid inputs. Please check the fields.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${company_id}/update-inventory/${editingItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedItem),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update inventory item.")
      }

      const updatedItemFromServer = await response.json()

      setInventoryItems((prevItems) =>
        prevItems.map((item) =>
          item._id === editingItem._id ? updatedItemFromServer : item
        )
      )

      setEditingItem(null)
      setErrorClass("no-error")
      setErrorMessage("")
    } catch (error) {
      console.error("Error updating inventory item:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to update inventory item. Try again.")
    }
  }

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Inventory Item ID is missing or undefined.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${company_id}/delete-inventory-item/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Error deleting inventory item.")
      }

      setInventoryItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      )
    } catch (error) {
      console.error("Error deleting inventory item:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to delete the inventory item. Try again.")
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  const filteredItems = Array.isArray(inventoryItems)
  ? inventoryItems.filter((item) =>
      item.product_name && item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : []


  return (
    <div className="list-container">
      {filteredItems.length === 0 ? (
        <p>No items found in the inventory.</p>
      ) : (
        <ul className="inventory-list">
          {filteredItems.map((item) => (
            <li key={item._id} className="inventory-item">
              {editingItem?._id === item._id ? (
                <form onSubmit={handleUpdate} className="edit-inventory-form">
                  <input
                    className="inventory-form-inputs"
                    type="text"
                    name="product_name"
                    defaultValue={item.product_name}
                  />
                  <input
                    className="inventory-form-inputs"
                    type="number"
                    name="price"
                    defaultValue={item.price}
                  />
                  <input
                    className="inventory-form-inputs"
                    type="number"
                    name="stock"
                    defaultValue={item.stock}
                  />
                  <input
                    className="inventory-form-inputs"
                    type="text"
                    name="category"
                    defaultValue={item.category}
                  />
                  <select
                    className="inventory-form-inputs"
                    name="state"
                    defaultValue={item.state}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <button className="save-edit-button" type="submit">
                    Save
                  </button>
                  <button
                    className="cancel-edit-button"
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="list-title">{item.product_name}</h3>
                  <p className="inventory-info">
                    <span className="list-span">Price:</span> {item.price}
                  </p>
                  <p className="inventory-info">
                    <span className="list-span">Stock:</span> {item.stock}
                  </p>
                  <p className="inventory-info">
                    <span className="list-span">Category:</span> {item.category}
                  </p>
                  <p className="inventory-info">
                    <span className="list-span">State:</span> {item.state}
                  </p>
                  {isAdmin && (
                    <>
                      <button className="edit-button" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default InventoryList