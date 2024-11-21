import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { usernameVerification, passwordVerification } from "../utils/index.js"
import "../styles/screen_styles/AddCompany.css"
import getAuthToken from "../utils/getAuthToken.js"

const AddCompany = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const navigate = useNavigate()

  const authToken = sessionStorage.getItem("auth_token")

  const getUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/companies/get-user-profile",
        {
          method: "GET",
          headers: getAuthToken(),
        }
      )

      if (response.ok) {
        return await response.json()
      } else {
        throw new Error("Failed to get user data. Please log in again.")
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const company_name = event.target["company_name"].value
    const password = event.target["password"].value

    const isPasswordValid = passwordVerification(password)
    const isCompanyNameValid = usernameVerification(company_name)

    if (!isCompanyNameValid || !isPasswordValid) {
      setErrorMessage("Invalid company name or password")
      setErrorClass("form-error")
      return
    }

    if (!authToken) {
      setErrorMessage("No token found. Please log in again.")
      setErrorClass("form-error")
      return
    }

    try {
      const userData = await getUserData()

      if (!userData) {
        setErrorMessage("Failed to get user data. Please log in again.")
        setErrorClass("form-error")
        return
      }

      const response = await fetch(
        "http://localhost:5000/api/companies/add-company",
        {
          method: "POST",
          headers: getAuthToken(),
          body: JSON.stringify({
            password: password,
            businessName: company_name,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        navigate("/home")
      } else {
        throw new Error(data.message || "Something went wrong.")
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(error.message || "An unexpected error occurred.")
      setErrorClass("form-error")
    }
  }

  return (
    <main className="add-company-container">
      <h1 className="h1-title">New Company</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-input-container">
          <label className="form-labels" htmlFor="company_name">
            Company's Name:
          </label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="text"
            id="company_name"
            name="company_name"
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
            id="password"
            name="password"
          />
        </div>
        <div className={errorClass}>
          <p>{errorMessage}</p>
        </div>
        <div className="form-links">
          <Link to="/join-company" className="form-link">
            I want to join a company
          </Link>
          <Link to="/home" className="form-link">
            Back to Home
          </Link>
        </div>
        <button className="form-submit-button" type="submit">
          Create
        </button>
      </form>
    </main>
  )
}

export default AddCompany