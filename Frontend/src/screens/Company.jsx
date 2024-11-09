import React from "react"
import {
  Inventory,
  Employees,
  Dashboard,
} from "../components/index.js"
import "../styles/screen_styles/Company.css"
import Aside from "../components/Aside.jsx"
import { Route, Routes } from "react-router-dom"

const Company = () => {
  return (
    <div className="company-container">
      <Aside />

      <main>
        <Routes>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />

           {/* <Route path="/profile" element={<Profile />} /> */}
       </Routes>
      </main>
    </div>
  )
}

export default Company
