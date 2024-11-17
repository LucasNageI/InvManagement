import React, { useEffect, useState } from "react"
import Header from "../components/Home/Header.jsx"
import Companies from "../components/Home/Companies.jsx"
import { Link } from "react-router-dom"
import "../styles/screen_styles/Home.css"

const Home = () => {
  const [companies, setCompanies] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchCompanies = async () => {
    const token = sessionStorage.getItem("auth_token")
    if (!token) {
      setError("User is not authenticated.")
      setLoading(false)
      return
    }

    setError(null)

    try {
      const authToken = sessionStorage.getItem("auth_token")

      const response = await fetch(
        "http://localhost:5000/api/companies/get-companies",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (response.status === 404) {
        console.warn("No companies found for this user.")
        setCompanies([])
        setLoading(false)
        return
      }

      if (!response.ok) {
        if (response.status === 403) {
          setError("Session expired. Please log in again.")
          sessionStorage.removeItem("auth_token")
        } else {
          setError("An error occurred while fetching companies.")
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      if (data.ok) {
        setCompanies(data.data || [])
      } else {
        setError(data.message || "An error occurred.")
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching companies:",
        error.message
      )
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])
  return (
    <div className="home-container">
      <Header />

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
      <div />
    </div>
  )
}

export default Home