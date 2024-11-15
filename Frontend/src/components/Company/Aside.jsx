import React, { useState } from "react"
import { Link } from "react-router-dom"
import "../../styles/component_styles/Company/Aside.css"

const Aside = () => {
  const [showModal, setShowModal] = useState(false)

  const handleLogout = () => {
    window.location.href = "/login"
  }

  const handleLogOutClick = () => {
    setShowModal(true)
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  return (
    <aside className="aside">
      <nav className="aside-nav">
        <ul className="aside-list">
          <li>
            <Link to="inventory" className="link aside-nav-links">
              <i className="bi bi-boxes"></i>
              <span className="aside-span">Inventory</span>
            </Link>
          </li>
          <li>
            <Link to="employees" className="link aside-nav-links">
              <i className="bi bi-person"></i>
              <span className="aside-span">Employees</span>
            </Link>
          </li>
          <li>
            <Link to="dashboard" className="link aside-nav-links">
              <i className="bi bi-info-circle"></i>
              <span className="aside-span">Dashboard</span>
            </Link>
          </li>
        </ul>
        <ul className="aside-list">
          <li>
            <Link to="profile" className="link aside-nav-links">
              <i className="bi bi-person"></i>
              <span className="aside-span">Profile</span>
            </Link>
          </li>
          <li>
            <button onClick={handleLogOutClick} className="log-out">
              <i className="bi bi-box-arrow-right"></i>
              <span className="aside-span">LogOut</span>
            </button>
          </li>
        </ul>
      </nav>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="back-btn" onClick={handleCancel}>
                Back
              </button>
              <button className="sure-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Aside