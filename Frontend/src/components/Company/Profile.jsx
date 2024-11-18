import React, { useEffect, useState } from "react"
import "../../styles/component_styles/Company/Profile.css"
import { useParams } from "react-router-dom"

const Profile = () => {
  const [companyData, setCompanyData] = useState({
    businessName: "",
    creationDate: "",
    secretKey: "",
  })

  const { company_id } = useParams()

  const authToken = sessionStorage.getItem("auth_token")
  const fetchCompanyData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${company_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch company data.")
      }

      const data = await response.json()

      const formattedDate = data.data.createdAt
        ? new Date(data.data.createdAt).toLocaleDateString()
        : "no date"

      setCompanyData({
        businessName: data.data.businessName,
        creationDate: formattedDate,
        secretKey: data.data.secretKey,
      })
    } catch (error) {
      console.error("Error fetching company data:", error)
    }
  }

  useEffect(() => {
    fetchCompanyData()
  }, [])

  return (
    <div className="profile-container">
      <h1>{companyData.businessName}</h1>
      <div>
        <ul className="profile-list">
          <li>
            <span className="bold-spans">Business Name</span>
            <span className="profile-spans">{companyData.businessName}</span>
          </li>
          <li>
            <span className="bold-spans">Creation Date</span>
            <span className="profile-spans">{companyData.creationDate}</span>
          </li>
          <li>
            <span className="bold-spans">Secret Key</span>
            <span className="profile-spans">{companyData.secretKey}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Profile