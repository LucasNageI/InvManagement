import React from "react"
import "../styles/screen_styles/NotFound.css"

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">Page Not Found</h1>
      <span className="not-found-text">
        The page you are looking for does not exist
      </span>
    </div>
  )
}
export default NotFound