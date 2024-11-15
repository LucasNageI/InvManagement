import React, { useState } from "react"
import "../styles/screen_styles/Register.css"
import { emailVerification } from "../utils/emailVerification"
import { passwordVerification } from "../utils/passwordVerification"
import { verifyPasswords } from "../utils/verifyPasswords"
import { usernameVerification } from "../utils/usernameVerification"
import { Link, useNavigate } from "react-router-dom"

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [errorClass, setErrorClass] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const username = event.target.username.value.trim()
    const email = event.target.email.value.trim()
    const password = event.target.password.value
    const confirm_password = event.target["confirm-password"].value

    const isUsernameValid = usernameVerification(username)
    const isEmailValid = emailVerification(email)
    const isPasswordValid = passwordVerification(password)
    const isSamePassword = verifyPasswords(password, confirm_password)

    if (!isUsernameValid) {
      setErrorMessage("Invalid username")
      setErrorClass(true)
      return
    }
    if (!isEmailValid) {
      setErrorMessage("Invalid email")
      setErrorClass(true)
      return
    }
    if (!isPasswordValid) {
      setErrorMessage(
        "At least 8 characters, including uppercase, lowercase, number, and special character"
      )
      setErrorClass(true)
      return
    }
    if (!isSamePassword) {
      setErrorMessage("Passwords do not match")
      setErrorClass(true)
      return
    }

    setErrorMessage("")
    setErrorClass(false)

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data.message)
        setErrorMessage("")
        event.target.reset()
        navigate("/waiting-to-verify-email")
      } else if (response.status === 409) {
        const errorData = await response.json()
        setErrorMessage(
          errorData.data?.detail ||
            "Email already exists"
        )
        setErrorClass(true)
        setTimeout(() => navigate("/login"), 3000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.message || "Registration failed")
        setErrorClass(true)
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setErrorMessage("Error connecting to the server")
      setErrorClass(true)
    }
  }

  return (
    <main className="register-container">
      <h1 className="h1-title">Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-input-container">
          <label className="form-labels">Username:</label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="text"
            name="username"
          />
        </div>
        <div className="form-input-container">
          <label className="form-labels">Email Address:</label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="email"
            name="email"
          />
        </div>
        <div className="form-input-container">
          <label className="form-labels">Password:</label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="password"
            name="password"
          />
        </div>
        <div className="form-input-container">
          <label className="form-labels">Confirm password:</label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="password"
            name="confirm-password"
          />
        </div>
        {errorClass && (
          <div className="form-error">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="form-links">
          <Link to="/login" className="form-link">
            Already have an account?
          </Link>
        </div>
        <button className="form-submit-button" type="submit">
          Sign up
        </button>
      </form>
    </main>
  )
}

export default Register
