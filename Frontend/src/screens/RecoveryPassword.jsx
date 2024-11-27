import React, { useState } from "react"
import "../styles/screen_styles/RecoveryPassword.css"
import { Link } from "react-router-dom"
import { emailVerification } from "../utils/emailVerification"

const RecoveryPassword = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)
    const email = event.target.email.value
    setErrorMessage(emailVerification(email))

    if (emailVerification(email)) {
      setErrorMessage("")
      setErrorClass("no-error")

      fetch(`${import.meta.env.VITE_APP_URL}/api/auth/recovery-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSuccessMessage(data.message)
            setLoading(false)
          } else {
            setErrorClass("form-error")
            setSuccessMessage("")
            setErrorMessage(data.message)
            setLoading(false)
          }
        })
        .catch((error) => {
          console.error("Error sending recovery email:", error)
          setErrorClass("form-error")
          setSuccessMessage("")
          setErrorMessage("Failed to send recovery email")
          setLoading(false)
        })
    } else {
      setErrorClass("form-error")
      setSuccessMessage("")
      setErrorMessage("Invalid email")
      setLoading(false)
    }
  }

  return (
    <main className="recovery-password-container">
      <h1 className="h1-title recovery-password-title">Recovery Password</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-input-container">
          <label className="form-labels" htmlFor="email">
            Email Address:
          </label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="email"
            id="email"
            name="email"
          />
        </div>
        <div className="email-sent-container">
          <p className="email-sent-message">{successMessage}</p>
        </div>
        <div className={errorClass}>
          <p className="form-error-message">{errorMessage}</p>
        </div>
        <div className="form-links">
          <Link to="/login" className="form-link">
            Back to login form
          </Link>
        </div>
        <button className="form-submit-button" type="submit" disabled={loading}>
          {loading ? "Sending Email..." : "Send Email"}
        </button>
      </form>
    </main>
  )
}

export default RecoveryPassword