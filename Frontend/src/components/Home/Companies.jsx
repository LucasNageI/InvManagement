import React from "react"
import { Link } from "react-router-dom"
import "../../styles/component_styles/Home/Companies.css"

const Company = ({ companies }) => {
  const companiesArray = companies.map((company) => {
    const formattedDate = company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "no date"
    return (
      <div className="company" key={company._id}>
        <div className="info-container">
          <span className="company-title">{company.businessName}</span>
          <span>Creation date: {formattedDate}</span>
        </div>
        <div className="launch-slack-container">
          <Link to={`/company/${company._id}/inventory`} className="launch-company">
            <button className="launch-btn">Launch</button>
          </Link>
        </div>
      </div>
    )
  })

  return (
    <div className="companies-list">
      {companiesArray.length > 0 ? companiesArray : <p>No companies found.</p>}
    </div>
  )
}

export default Company