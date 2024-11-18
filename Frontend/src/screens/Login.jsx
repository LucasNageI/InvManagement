import React, { useState, useEffect } from "react"
import "../styles/screen_styles/Login.css"
import { emailVerification, passwordVerification } from "../utils"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token")
    if (token) {
      navigate("/home")
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value

    const isEmailValid = emailVerification(email)
    const isPasswordValid = passwordVerification(password)

    if (!isEmailValid) {
      setErrorMessage("Invalid email")
      setErrorClass("form-error")
      return
    }
    if (!isPasswordValid) {
      setErrorMessage(
        "At least 8 Characters, Uppercase, Lowercase, Number, !@#$%^&*_"
      )
      setErrorClass("form-error")
      return
    }

    try {
        
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()
      

      if (data.data.user.emailVerified) {
        sessionStorage.setItem("auth_token", data.data.token)
        navigate("/home")
      } else {
        setErrorMessage("Email not verified")
        setErrorClass("form-error")
        navigate("/waiting-to-verify-email")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage(error.message)
      setErrorClass("form-error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-container">
      <h1 className="h1-title">Member Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-inputs-container">
          <div className="form-input-container">
            <label className="form-labels" htmlFor="email">
              Email:
            </label>
            <input
              className="form-inputs"
              autoComplete="off"
              type="email"
              name="email"
              aria-label="Email"
            />
          </div>
          <div className="form-input-container">
            <label className="form-labels" htmlFor="password">
              Password:
            </label>
            <input
              className="form-inputs"
              autoComplete="off"
              type="password"
              name="password"
              aria-label="Password"
            />
          </div>
        </div>
        <div className={errorClass}>
          <i className="bi bi-exclamation-triangle-fill"></i>
          <p>{errorMessage}</p>
        </div>
        <div className="form-links">
          <Link to="/register" className="form-link">
            Don't have an account?
          </Link>
          <Link to="/recovery-password" className="form-link">
            Forgot password?
          </Link>
          <Link to="/waiting-to-verify-email" className="form-link">
            Verify Email
          </Link>
        </div>
        <button className="form-submit-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  )
}

export default Login