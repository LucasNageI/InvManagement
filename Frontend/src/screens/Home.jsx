import React from "react"
import Header from "../components/Home/Header.jsx"
import Companies from "../components/Home/Companies.jsx"
import { Link } from "react-router-dom"
import "../styles/screen_styles/Home.css"

const Home = ({ companies }) => {
  return (
    <div className="home-container">
      <Header />

      <h1 className="h1-title welcome">Welcome Back!</h1>
      <div className="companies-container">
        <div className="companies-title-container">
          <span className="companies-title">Your Companies</span>
        </div>
        <div>
          <Companies companies={companies} />
        </div>
        <div className="company">
          <div className="info-container">
            <span className="company-title">New Company</span>
            <span>Not created</span>
          </div>
          <div>
            <Link to="/add-company">
              <button className="launch-btn">Create</button>
            </Link>
          </div>
        </div>
        <div>
          <Link to="/add-company"></Link>
        </div>
      </div>
      <div />
    </div>
  )
}

export default Home