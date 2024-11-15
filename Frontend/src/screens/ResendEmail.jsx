import React, { useState } from "react"
import "../styles/screen_styles/ResendEmail.css"

function ResendEmail() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResend = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setMessage("Please, enter a valid email.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.log("Server error:", errorData)
        throw new Error("Error sending email")
      }

      setMessage("Email sent successfully, please check your inbox.")
    } catch (error) {
      setMessage(
        "An error occurred while sending the email. Please try again."
      )
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="resend-email-container">
      <h1 className="h1-title">Resend Email</h1>
      <input
        className="form-inputs"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="resend-email-button"
        onClick={handleResend}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Resend Email"}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default ResendEmail