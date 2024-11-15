import React, { useState } from "react"
import "../../styles/component_styles/Company/Inventory.css"
import { isPositiveNumber, usernameVerification } from "../../utils"

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const [errorMessage, setErrorMessage] = useState("")
  const [products, setProducts] = useState([
    {
      id: 1,
      product_name: "Product A",
      price: 150,
      stock: 8,
      state: "Active",
      category: "Electronics",
    },
    {
      id: 2,
      product_name: "Product B",
      price: 80,
      stock: 20,
      state: "Inactive",
      category: "Furniture",
    },
    {
      id: 3,
      product_name: "Product C",
      price: 120,
      stock: 3,
      state: "Active",
      category: "Clothing",
    },
    {
      id: 4,
      product_name: "Product D",
      price: 50,
      stock: 50,
      state: "Active",
      category: "Sports",
    },
    {
      id: 5,
      product_name: "Product E",
      price: 200,
      stock: 1,
      state: "Inactive",
      category: "Electronics",
    },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()

    const product_name = e.target.product_name.value
    const price = e.target.price.value
    const stock = e.target.stock.value
    const category = e.target.category.value

    const isProductNameValid = usernameVerification(product_name)
    const isPriceValid = isPositiveNumber(price)
    const isStockValid = isPositiveNumber(stock)
    const isCategoryValid = usernameVerification(category)

    if (!isProductNameValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid name")
    } else if (!isPriceValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid price number")
    } else if (!isStockValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid stock number")
    } else if (!isCategoryValid) {
      setErrorClass("form-error")
      setErrorMessage("Invalid category name")
    } else {
      const newItem = {
        id: products.length + 1,
        product_name,
        price,
        stock,
        state: "Active",
        category,
      }
      setProducts([...products, newItem])
      setErrorClass("no-error")
      setErrorMessage("")
      e.target.reset()
    }
  }

  const filteredProducts = products.filter((item) =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    )
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
              <li key={item.id} className="inventory-item">
                <div>
                  <h3 className="list-title">{item.name}</h3>
                </div>
                <div>
                  <span className="list-span">ID:</span> {item.id}
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
                    onClick={() => handleDelete(item.id)}
                  >
                    <span>Delete</span>
                    <i className="bi bi-trash table-icon"></i>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No products found</li>
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