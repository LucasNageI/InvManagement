import React, { useEffect, useState } from "react"
import Header from "../components/Home/Header.jsx"
import Companies from "../components/Home/Companies.jsx"
import { Link, useNavigate } from "react-router-dom"
import "../styles/screen_styles/Home.css"
import getAuthToken from "../utils/getAuthToken.js"

const Home = () => {
  const [companies, setCompanies] = useState([])
  const [showLogoutScreen, setShowLogoutScreen] = useState(false)
const navigate = useNavigate()
  const handleLogOutClick = () => {
    setShowLogoutScreen(true)
  }

  const handleLogout = () => {
    navigate("/landing")
    sessionStorage.removeItem("auth_token")
  }

  const handleCancel = () => {
    setShowLogoutScreen(false)
  }

  const fetchCompanies = async () => {
    const token = sessionStorage.getItem("auth_token")
    if (!token) {
      navigate("/login")
      return
    }

    try {

      const response = await fetch(
        "http://localhost:5000/api/companies/get-companies",
        {
          method: "GET",
          headers: getAuthToken(),
        }
      )

      if (response.status === 404) {
        console.warn("No companies found for this user.")
        setCompanies([])
        return
      }

      if (!response.ok) {
        if (response.status === 403) {
          sessionStorage.removeItem("auth_token")
        }
        return
      }

      const data = await response.json()
      if (data.ok) {
        setCompanies(data.data || [])
      } else {
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching companies:",
        error.message
      )
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])
  return (
    <div className="home-container">
      <Header />
    <div className="welcome-container">
      <h1 className="h1-title welcome">Welcome Back!</h1>
      <div className="companies-container">
        <div className="companies-title-container">
          <span className="companies-title">Your Companies</span>
        </div>
        <div>
          <Companies companies={companies} />
        </div>
        <div className="company">
          <div className="info-container">
            <span className="company-title">New Company</span>
            <span>Not created</span>
          </div>
          <div>
            <Link to="/add-company">
              <button className="launch-btn">Create</button>
            </Link>
          </div>
        </div>
      </div>
      </div>
      <button onClick={handleLogOutClick} className="log-out">
        <i className="bi bi-box-arrow-right"></i>
        <span className="log-out-span">LogOut</span>
      </button>
      {showLogoutScreen && (
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
      <div />
    </div>
  )
}

export default Home