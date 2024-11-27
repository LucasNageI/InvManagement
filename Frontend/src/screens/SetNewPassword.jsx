import React, { useState } from "react"
import "../styles/screen_styles/SetNewPassword.css"
import { verifyPasswords } from "../utils/verifyPasswords"
import { passwordVerification } from "../utils/passwordVerification"
import { Link, useNavigate } from "react-router-dom"

const SetNewPassword = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const password = event.target.password.value
    const confirm_password = event.target["confirm-password"].value
    const token = new URLSearchParams(window.location.search).get("token")

    if (!passwordVerification(password)) {
      setErrorMessage(
        "At least 8 Characters, Uppercase, Lowercase, Number, !@#$%^&*_"
      )
      setErrorClass("form-error")
    } else if (!verifyPasswords(password, confirm_password)) {
      setErrorMessage("Passwords do not match")
      setErrorClass("form-error")
    } else {
      setErrorMessage("")
      setErrorClass("no-error")

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/reset-password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
          }
        )

        const data = await response.json()

        if (data.success) {
          setSuccessMessage("Password updated successfully.")
          setTimeout(() => {
            navigate("/login")
          }, 2000)
        } else {
          setErrorClass("form-error")
          setErrorMessage(data.message || "Error updating password.")
        }
      } catch (error) {
        console.error("Error in fetch:", error)
        setErrorClass("form-error")
        setErrorMessage("Error resetting password.")
      }
    }
  }

  return (
    <main className="set-new-password-container">
      <h1 className="h1-title set-new-password-title">Set New Password</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-input-container">
          <label className="form-labels" htmlFor="password">
            New password
          </label>
          <input
            className="form-inputs"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <div className="form-input-container">
          <label className="form-labels" htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            className="form-inputs"
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
          />
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className={errorClass}>
          <p>{errorMessage}</p>
        </div>
        <div className="form-links">
          <Link to="/login" className="form-link">
            Back to login form
          </Link>
        </div>
        <button className="form-submit-button" type="submit">
          Done
        </button>
      </form>
    </main>
  )
}

export default SetNewPassword