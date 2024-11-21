import React, { useEffect, useState } from "react"
import {
  Inventory,
  Employees,
  Dashboard,
  Aside,
  Profile,
  NotFound,
} from "../components/index.js"
import { useParams, Navigate } from "react-router-dom"
import "../styles/screen_styles/Company.css"
import { Route, Routes } from "react-router-dom"
import getAuthToken from "../utils/getAuthToken.js"

const Company = () => {
  const { company_id } = useParams()
  const [companyExists, setCompanyExists] = useState(false)
  const [userHasAccess, setUserHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const authToken = sessionStorage.getItem("auth_token")

  useEffect(() => {
    const checkCompanyAccess = async () => {
      if (!authToken) {
        setError("No token provided.")
        setLoading(false)
        return
      }

      try {
        const companyResponse = await fetch(
          `http://localhost:5000/api/companies/${company_id}`,
          {
            method: "GET",
            headers: getAuthToken(),
          }
        )

        if (!companyResponse.ok) {
          setCompanyExists(false)
          setError("Company not found or error fetching data.")
          return
        }

        const companyData = await companyResponse.json()
        setCompanyExists(true)

        const userResponse = await fetch(
          "http://localhost:5000/api/companies/get-user-profile",
          {
            method: "GET",
            headers: getAuthToken(),
          }
        )

        if (!userResponse.ok) {
          setUserHasAccess(false)
          setError("Error fetching user profile.")
          return
        }

        const userData = await userResponse.json()

        if (
          userData._id === companyData.adminUser ||
          companyData.users.includes(userData._id)
        ) {
          setUserHasAccess(true)
        } else {
          setUserHasAccess(false)
        }
      } catch (error) {
        console.error("Error checking company access:", error)
        setError("An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }

    checkCompanyAccess()
  }, [company_id, authToken])

  if (loading) {
    return <h1 className="h1-title">Loading...</h1>
  }

  if (error) {
    return <Navigate to="/404" replace />
  }

  if (!companyExists || !userHasAccess) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="company-container">
      <Aside />

      <main className="company-main">
        <Routes>
          <Route path="inventory" element={<Inventory />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default Company