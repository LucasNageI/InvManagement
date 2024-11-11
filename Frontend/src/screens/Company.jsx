import React from "react"
import {
  Inventory,
  Employees,
  Dashboard,
  Aside,
  Profile,
  NotFound,
} from "../components/index.js"
import { useParams, Navigate } from "react-router-dom"
import "../styles/screen_styles/Company.css"
import { Route, Routes } from "react-router-dom"

const Company = ( { companies } ) => {

    const { company_id } = useParams();

    const companyExists = companies.some(
        (company) => company.id === parseInt(company_id, 10)
    );

    if (!companyExists) {
        // Si no existe, redirige a una página 404
        return <Navigate to="/404" replace />;
    }
    
  return (
    <div className="company-container">
      <Aside />

      <main className="company-main">
        <Routes>
            <Route path="inventory" element={<Inventory />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="*" element={<NotFound />} />

            
       </Routes>
      </main>
    </div>
  )
}

export default Company
