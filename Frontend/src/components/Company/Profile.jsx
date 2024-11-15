import React from "react"
import "../../styles/component_styles/Company/Profile.css"

const Profile = () => {
  const secretKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

  return (
    <div className="profile-container">
      <h1>Company's Name</h1>
      <div>
        <ul className="profile-list">
          <li>
            <span className="bold-spans">Business Name</span>
            <span className="profile-spans">"Company's Name"</span>
          </li>
          <li>
            <span className="bold-spans">Creation Date</span>
            <span className="profile-spans">xx-xx-xxxx</span>
          </li>
          <li>
            <span className="bold-spans">Business Email</span>
            <span className="profile-spans">business.email@gmail.com</span>
          </li>
          <li>
            <span className="bold-spans">Secret Key</span>
            <span className="profile-spans">{secretKey}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Profile
