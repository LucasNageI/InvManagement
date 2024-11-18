import React from "react"
import { Link } from "react-router-dom"
import "../styles/screen_styles/WaitingToVerifyEmail.css"

function WaitingToVerifyEmail() {
  return (
    <div className="waiting-to-verify-email-container">
      <h1 className="h1-title">Verify your email</h1>
      <p className="waiting-to-verify-email-text">
        You must have verified your email address.
      </p>
      <p className="waiting-to-verify-email-text">
        Please check your email inbox to verify your email, if you dont see the
        email,{" "}
        <Link className="waiting-to-verify-email-link" to="/resend-email">
          request a new email verification
        </Link>
        .
      </p>
      <p className="waiting-to-verify-email-text">
        If you already verified your email,{" "}
        <Link className="waiting-to-verify-email-link" to="/login">
          Log In
        </Link>
        {" "}to start using InvManagement.
      </p>
    </div>
  )
}

export default WaitingToVerifyEmail