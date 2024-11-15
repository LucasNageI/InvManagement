import React from "react"
import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("auth_token")

  if (!token) {
    return <Navigate to="/landing" replace />
  }

  return children
}

export default PrivateRoute