import React from "react"
import "../styles/screen_styles/Landing.css"
import { Link } from "react-router-dom"

const Landing = () => {
  return (
    <main className="landing-container">
      <div className="landing-title-and-logo">
        <img
          className="landing-logo"
          src="/open-box-white.svg"
          alt="InvManagement Logo"
        />
        <h1 className="landing-title">InvManagement</h1>
      </div>
      <div>
        <h2 className="landing-slogan">
          The best site to <span className="highlight">manage</span> your{" "}
          <span className="highlight">company</span>.
        </h2>
      </div>
      <div className="landing-buttons">
        <Link to="/register">
          <button className="landing-button get-started">Get Started</button>
        </Link>

        <Link to="/login">
          <button className="landing-button landing-login">Login</button>
        </Link>
      </div>
    </main>
  )
}

export default Landing