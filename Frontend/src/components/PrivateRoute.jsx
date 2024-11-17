import React from "react"
import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children }) => {
  const authToken = sessionStorage.getItem("auth_token")

  if (!authToken) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute