import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import "../styles/screen_styles/EmailVerified.css"

const EmailVerified = () => {
  const [verified, setVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const location = useLocation()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const validationToken = queryParams.get("validation_token")

    if (validationToken) {
      fetch(`http://localhost:5000/api/auth/verify-email/${validationToken}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setVerified(true)
            setErrorMessage("")
          } else {
            setErrorMessage(
              data.message ||
                "There was an error verifying your email. Please try again"
            )
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error)
          setErrorMessage(
            "There was an error verifying your email. Please try again"
          )
        })
    } else {
      setErrorMessage("Verification token not found.")
    }
  }, [location])

  return (
    <div className="email-verified-container">
      {verified ? (
        <h1 className="email-verified-h1">
          Email verified successfully. You can close this window
        </h1>
      ) : (
        <h1 className="email-verified-h1">{errorMessage || "Verifying..."}</h1>
      )}
    </div>
  )
}

export default EmailVerified
