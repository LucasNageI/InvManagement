import React, { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import {
  Landing,
  AddCompany,
  JoinCompany,
  Company,
  Home,
  Login,
  Register,
  RecoveryPassword,
  SetNewPassword,
  WaitingToVerifyEmail,
  ResendEmail,
  EmailVerified,
} from "./screens/index.js"

import NotFound from "./components/NotFound.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"

function App() {
  const [companies, setCompanies] = useState([])

  const fetchCompanies = async () => {
    const token = sessionStorage.getItem("auth_token")
    if (!token) return

    try {
      const response = await fetch("http://localhost:5000/api/companies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 404) {
        console.warn("No companies found for this user.")
        setCompanies([])
        return
      }

      if (!response.ok) {
        throw new Error("Error fetching companies")
      }

      const data = await response.json()
      setCompanies(data)
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
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<Landing />} />

      <Route path="/register" element={<Register />} />
      <Route
        path="/waiting-to-verify-email"
        element={<WaitingToVerifyEmail />}
      />
      <Route path="/resend-email" element={<ResendEmail />} />
      <Route path="/email-verified" element={<EmailVerified />} />

      <Route path="/login" element={<Login />} />

      <Route path="/recovery-password" element={<RecoveryPassword />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />

      {/*rutas privadas*/}

      <Route
        path="/home"
        element={
          <PrivateRoute>
            {" "}
            <Home companies={companies} />{" "}
          </PrivateRoute>
        }
      />

      <Route
        path="/add-company"
        element={
          <PrivateRoute>
            {" "}
            <AddCompany />{" "}
          </PrivateRoute>
        }
      />
      <Route
        path="/join-company"
        element={
          <PrivateRoute>
            {" "}
            <JoinCompany />{" "}
          </PrivateRoute>
        }
      />
      <Route
        path="/company/:company_id/*"
        element={
          <PrivateRoute>
            {" "}
            <Company companies={companies} />{" "}
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App