import React, { useState } from "react";
import "../../styles/component_styles/Company/Inventory.css";

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", price: 150, stock: 8, state: "Active", category: "Electronics" },
    { id: 2, name: "Product B", price: 80, stock: 20, state: "Inactive", category: "Furniture" },
    { id: 3, name: "Product C", price: 120, stock: 3, state: "Active", category: "Clothing" },
    { id: 4, name: "Product D", price: 50, stock: 50, state: "Active", category: "Sports" },
    { id: 5, name: "Product E", price: 200, stock: 1, state: "Inactive", category: "Electronics" },
  ]);

  // Filtrar productos según la búsqueda
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para eliminar un producto
  const handleDelete = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  return (
    <div className="inventory-container">
      <h1 className="h1-title">Inventory</h1>

      <input
        onChange={(e) => setSearchQuery(e.target.value)} // Actualizar el valor de búsqueda
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
                    onClick={() => handleDelete(item.id)} // Llamar a la función handleDelete
                  >
                    <span>Delete</span>
                    <i className="bi bi-trash table-icon"></i>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No products found</li> // Mensaje si no se encuentran productos
          )}
        </ul>
      </div>

      <h2 className="h2-title">Add Product</h2>
      <form className="inventory-form">
        <div className="inventory-form-inputs-container">
          <label className="inventory-form-labels" htmlFor="name">Product Name:</label>
          <input className="inventory-form-inputs" type="text" id="name" />
        </div>
        <div className="inventory-form-inputs-container">
          <label className="inventory-form-labels" htmlFor="price">Price:</label>
          <input className="inventory-form-inputs" type="number" id="price" />
        </div>
        <div className="inventory-form-inputs-container">
          <label className="inventory-form-labels" htmlFor="stock">Stock:</label>
          <input className="inventory-form-inputs" type="number" id="stock" />
        </div>
        <div className="inventory-form-inputs-container">
          <label className="inventory-form-labels" htmlFor="state">State:</label>
          <select className="inventory-form-inputs" id="state">
            <option value="Active">Avalible</option>
            <option value="Inactive">Not Avalible</option>
          </select>
        </div>
        <div className="inventory-form-inputs-container">
          <label className="inventory-form-labels" htmlFor="category">Category:</label>
          <input className="inventory-form-inputs" type="text" id="category" />
        </div>
        <button className="form-submit-button">Save</button>
      </form>
    </div>
  );
};

export default Inventory;
