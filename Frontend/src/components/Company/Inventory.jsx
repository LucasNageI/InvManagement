import React, { useEffect, useState } from "react"
import "../../styles/component_styles/Company/Inventory.css"
import { isPositiveNumber, usernameVerification } from "../../utils"
import { useParams } from "react-router-dom"
import InventoryList from "./InventoryList"
import getAuthToken from "../../utils/getAuthToken"

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const [errorMessage, setErrorMessage] = useState("")
  const [inventoryItems, setInventoryItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const authToken = sessionStorage.getItem("auth_token")
  const { company_id } = useParams()

  const fetchAllInventoryItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${company_id}/get-inventory`,
        {
          method: "GET",
          headers: getAuthToken(),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch inventory items.")
      }

      const result = await response.json()

      if (Array.isArray(result.data)) {
        setInventoryItems(result.data)
      } else {
        console.error("Data is not an array:", result)
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error)
    }
  }
  const checkIfUserIsAdmin = async () => {
    try {
      const companyResponse = await fetch(
        `http://localhost:5000/api/companies/${company_id}`,
        {
          method: "GET",
          headers: getAuthToken(),
        }
      )

      if (!companyResponse.ok) {
        throw new Error("Error fetching company data.")
      }

      const companyData = await companyResponse.json()

      const userResponse = await fetch("http://localhost:5000/api/companies/get-user-profile", {
        method: "GET",
        headers: getAuthToken(),
      })

      if (!userResponse.ok) {
        throw new Error("Error fetching user profile.")
      }

      const userData = await userResponse.json()

      if (userData.data._id === companyData.data.adminUser) {
        setIsAdmin(true)
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
    }
  }

  useEffect(() => {
    fetchAllInventoryItems()
    checkIfUserIsAdmin()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const product_name = e.target.product_name.value
    const price = e.target.price.value
    const stock = e.target.stock.value
    const category = e.target.category.value
  
    if(
        !usernameVerification(product_name) ||
        !isPositiveNumber(price) ||
        !isPositiveNumber(stock)
      ) {
      return
    }
  
    const newItem = {
      product_name,
      price,
      stock,
      category,
      state: "Active",
      company_id: company_id,
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${company_id}/inventory`,
        {
          method: "POST",
          headers: getAuthToken(),
          body: JSON.stringify(newItem),
        }
      )
  
      if (!response.ok) {
        throw new Error("Error saving inventory item.")
      }
  
      const savedItem = await response.json()
  
      setInventoryItems((prevItems) => [...prevItems, savedItem.data])
  
      e.target.reset()
    } catch (error) {
      console.error("Error saving inventory item:", error)
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
        company_id={company_id}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        isAdmin={isAdmin}
      />

      {isAdmin && !editingItem && (
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
              />
            </div>
            <button className="form-submit-button" type="submit">
              Add Inventory Item
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default Inventory