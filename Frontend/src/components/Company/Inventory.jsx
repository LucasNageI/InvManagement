import React, { useEffect, useState } from "react"
import "../../styles/component_styles/Company/Inventory.css"
import { isPositiveNumber, usernameVerification } from "../../utils"
import { useParams } from "react-router-dom"
import InventoryList from "./InventoryList"

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const [errorMessage, setErrorMessage] = useState("")
  const [inventoryItems, setInventoryItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const authToken = sessionStorage.getItem("auth_token")
  const { company_id } = useParams()

  const fetchAllInventoryItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${company_id}/get-inventory`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch inventory items.")
      }

      const data = await response.json()
      setInventoryItems(data)
    } catch (error) {
      console.error("Error fetching inventory items:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to fetch inventory items. Please try again.")
    }
  }

  useEffect(() => {
    fetchAllInventoryItems()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const product_name = e.target.product_name.value
    const price = e.target.price.value
    const stock = e.target.stock.value
    const category = e.target.category.value

    if (
      !usernameVerification(product_name) ||
      !isPositiveNumber(price) ||
      !isPositiveNumber(stock)
    ) {
      setErrorClass("form-error")
      setErrorMessage("Invalid inputs. Please check the fields.")
      return
    }

    const newItem = {
      product_name,
      price,
      stock,
      category,
      state: "Active",
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${company_id}/inventory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newItem),
        }
      )

      if (!response.ok) {
        throw new Error("Error saving inventory item.")
      }

      const savedItem = await response.json()
      setInventoryItems((prevItems) => [...prevItems, savedItem])
      setErrorClass("no-error")
      setErrorMessage("")
      e.target.reset()
    } catch (error) {
      console.error("Error saving inventory item:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to save the inventory item. Try again.")
    }
  }

  return (
    <div className="inventory-container">
      <h1 className="h1-title">Inventory</h1>

      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Search by Product Name"
        value={searchQuery}
        className="search-input"
      />

      <InventoryList
        inventoryItems={inventoryItems}
        searchQuery={searchQuery}
        setInventoryItems={setInventoryItems}
        authToken={authToken}
        company_id={company_id}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        setErrorClass={setErrorClass}
        setErrorMessage={setErrorMessage}
      />

      {!editingItem && (
        <>
          <h2 className="h2-title">Add Inventory Item</h2>
          <form onSubmit={handleSubmit} className="inventory-form">
            <div className="inventory-form-inputs-container">
              <label className="inventory-form-labels" htmlFor="product_name">
                Product Name:
              </label>
              <input
                className="inventory-form-inputs"
                type="text"
                name="product_name"
                id="product_name"
              />
            </div>
            <div className="inventory-form-inputs-container">
              <label className="inventory-form-labels" htmlFor="price">
                Price:
              </label>
              <input
                className="inventory-form-inputs"
                type="number"
                name="price"
                id="price"
              />
            </div>
            <div className="inventory-form-inputs-container">
              <label className="inventory-form-labels" htmlFor="stock">
                Stock:
              </label>
              <input
                className="inventory-form-inputs"
                type="number"
                name="stock"
                id="stock"
              />
            </div>
            <div className="inventory-form-inputs-container">
              <label className="inventory-form-labels" htmlFor="category">
                Category:
              </label>
              <input
                className="inventory-form-inputs"
                type="text"
                name="category"
                id="category"
              />
            </div>
            <button className="form-submit-button" type="submit">
              Add Inventory Item
            </button>
          </form>
        </>
      )}

      {errorMessage && <p className={errorClass}>{errorMessage}</p>}
    </div>
  )
}

export default Inventory