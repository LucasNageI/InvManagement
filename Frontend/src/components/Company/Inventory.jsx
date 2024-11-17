import React, { useEffect, useState } from "react"
import "../../styles/component_styles/Company/Inventory.css"
import { isPositiveNumber, usernameVerification } from "../../utils"
import { useParams } from "react-router-dom"

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const [errorMessage, setErrorMessage] = useState("")
  const [products, setProducts] = useState([])
  const authToken = sessionStorage.getItem("auth_token")
  const { company_id } = useParams()
  const fetchAllProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/:company_id/get-inventory`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch products.")
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to fetch products. Please try again.")
    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const product_name = e.target.product_name.value
    const price = e.target.price.value
    const stock = e.target.stock.value
    const state = e.target.state.value
    const category = e.target.category.value

    const isProductNameValid = usernameVerification(product_name)
    const isPriceValid = isPositiveNumber(price)
    const isStockValid = isPositiveNumber(stock)
    const isCategoryValid = usernameVerification(category)

    if (!isProductNameValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid name")
      return
    }
    if (!isPriceValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid price number")
      return
    }
    if (!isStockValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid stock number")
      return
    }
    if (!isCategoryValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid category name")
      return
    }

    const newProduct = {
      product_name,
      price,
      stock,
      state,
      category,
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/companies/:company_id/inventory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newProduct),
        }
      )

      if (!response.ok) {
        throw new Error("Error saving product.")
      }

      const savedProduct = await response.json()

      setProducts((prevProducts) => [...prevProducts, savedProduct])
      setErrorClass("no-error")
      setErrorMessage("")
      e.target.reset()
    } catch (error) {
      console.error("Error saving product:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to save the product. Try again.")
    }
  }

  const filteredProducts = products.filter((item) =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Product ID is missing or undefined.")
      return
    }
    console.log(
      `http://localhost:5000/api/companies/${company_id}/delete-inventory-item/${id}`
    )

    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${company_id}/delete-inventory-item/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Error deleting product.")
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      )
    } catch (error) {
      console.error("Error deleting product:", error)
      setErrorClass("form-error")
      setErrorMessage("Failed to delete the product. Try again.")
    }
  }
  return (
    <div className="inventory-container">
      <h1 className="h1-title">Inventory</h1>

      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Search by Name"
        value={searchQuery}
        className="search-input"
      />

      <div className="list-container">
        <ul className="inventory-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <li key={item._id} className="inventory-item">
                <div>
                  <h3 className="list-title">{item.product_name}</h3>
                </div>
                <div>
                  <span className="list-span">ID:</span> {item._id}
                </div>
                <div>
                  <span className="list-span">Price:</span> {item.price}
                </div>
                <div>
                  <span className="list-span">Stock:</span> {item.stock}
                </div>
                <div>
                  <span className="list-span">State:</span> {item.state}
                </div>
                <div>
                  <span className="list-span">Category:</span> {item.category}
                </div>
                <div className="inventory-actions">
                  <button
                    className="table-icon-button delete-button"
                    onClick={() => handleDelete(item._id)}
                  >
                    <span>Delete</span>
                    <i className="bi bi-trash table-icon"></i>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="no-products-found-message">No products found</li>
          )}
        </ul>
      </div>

      <h2 className="h2-title">Add Product</h2>
      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="inventory-form-inputs-container">
          <label className="inventory-form-labels" htmlFor="product_name">
            Product Name:
          </label>
          <input
            className="inventory-form-inputs"
            type="text"
            id="product_name"
            name="product_name"
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
            id="price"
            name="price"
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
            id="stock"
            name="stock"
            autoComplete="off"
          />
        </div>
        <div className="inventory-form-inputs-container">
          <label className="inventory-form-labels" htmlFor="state">
            State:
          </label>
          <select className="inventory-form-inputs" id="state">
            <option value="Active">Avalible</option>
            <option value="Inactive">Not Avalible</option>
          </select>
        </div>
        <div className="inventory-form-inputs-container">
          <label className="inventory-form-labels" htmlFor="category">
            Category:
          </label>
          <input
            className="inventory-form-inputs"
            type="text"
            id="category"
            name="category"
            autoComplete="off"
          />
        </div>
        <div className={errorClass}>
          <i className="bi bi-exclamation-triangle-fill"></i>
          <p>{errorMessage}</p>
        </div>
        <button className="form-submit-button">Save</button>
      </form>
    </div>
  )
}

export default Inventory