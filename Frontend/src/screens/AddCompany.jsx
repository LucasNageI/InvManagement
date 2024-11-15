import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import {
  usernameVerification,
  emailVerification,
  passwordVerification,
  verifyPasswords,
} from "../utils/index.js"
import "../styles/screen_styles/AddCompany.css"

const AddCompany = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [errorClass, setErrorClass] = useState("no-error")
  const navigate = useNavigate()

  const authToken = sessionStorage.getItem("auth_token")

  const handleSubmit = async (event) => {
    event.preventDefault()
    const company_name = event.target["company_name"].value
    const business_email = event.target["business_email"].value
    const business_password = event.target["business_password"].value
    const confirm_password = event.target["confirm_business_password"].value

    // Validaciones
    const isCompanyNameValid = usernameVerification(company_name)
    const isBusinessEmailValid = emailVerification(business_email)
    const isBusinessPasswordValid = passwordVerification(business_password)
    const isSamePassword = verifyPasswords(business_password, confirm_password)

    if (
      !isCompanyNameValid ||
      !isBusinessEmailValid ||
      !isBusinessPasswordValid ||
      !isSamePassword
    ) {
      setErrorMessage("Please fix the errors in the form")
      setErrorClass("form-error")
    } else {
      try {
        const response = await fetch(
          "http://localhost:5000/api/companies/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              businessEmail: business_email,
              businessPassword: business_password,
              businessName: company_name,
            }),
          }
        )

        const data = await response.json()
        if (response.ok) {
          console.log(data)
          navigate("/home")
        } else {
          throw new Error(`Error: ${data.message}`)
        }
      } catch (error) {
        console.error(error)
      }
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
          <label className="form-labels" htmlFor="business_email">
            Business Email Address:
          </label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="email"
            id="business_email"
            name="business_email"
          />
        </div>
        <div className="form-input-container">
          <label className="form-labels" htmlFor="business_password">
            Business Password:
          </label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="password"
            id="business_password"
            name="business_password"
          />
        </div>
        <div className="form-input-container">
          <label className="form-labels" htmlFor="confirm_business_password">
            Confirm Business Password:
          </label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="password"
            id="confirm_business_password"
            name="confirm_business_password"
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