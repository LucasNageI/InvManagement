import React, { useState } from "react"
import "../../styles/component_styles/Company/Aside.css"
import { Link, useNavigate } from "react-router-dom"

const Aside = () => {
  const [showLogoutScreen, setShowLogoutScreen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/landing")
    sessionStorage.removeItem("auth_token")
  }

  const handleLogOutClick = () => {
    setShowLogoutScreen(true)
  }

  const handleCancel = () => {
    setShowLogoutScreen(false)
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

      {showLogoutScreen && (
        <div className="log-out-screen-overlay">
          <div className="log-out-screen">
            <p>Are you sure you want to log out?</p>
            <div className="log-out-screen-actions">
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