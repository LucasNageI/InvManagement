import React, { useEffect, useState } from "react"
import "../../styles/component_styles/Company/Dashboard.css"
import { useParams } from "react-router-dom"
import getAuthToken from "../../utils/getAuthToken"

const Dashboard = () => {
  const [inventoryData, setInventoryData] = useState({
    totalProducts: 0,
    availableProducts: 0,
    notAvailableProducts: 0,
  })

  const [employeesData, setEmployeesData] = useState({
    totalEmployees: 0,
    totalSalaries: 0,
  })

  const { company_id } = useParams()

  const fetchInventoryData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL}5000/api/inventory/${company_id}/get-inventory`,
        {
          method: "GET",
          headers: getAuthToken(),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch inventory data.")
      }

      const data = await response.json()

      if (Array.isArray(data.data)) {
        const totalProducts = data.data.length
        const availableProducts = data.data.filter((item) => item.state === "Active").length
        const notAvailableProducts = totalProducts - availableProducts

        setInventoryData({
          totalProducts,
          availableProducts,
          notAvailableProducts,
        })
      } else {
        console.error("Fetched inventory data is not an array:", data.data)
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error)
    }
  }

  const fetchEmployeesData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL}/api/employees/${company_id}/get-employees`,
        {
          method: "GET",
          headers: getAuthToken(),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch employees data.")
      }

      const data = await response.json()

      if (Array.isArray(data.data)) {
        const totalEmployees = data.data.length
        const totalSalaries = data.data.reduce((sum, employee) => sum + parseFloat(employee.salary), 0)

        setEmployeesData({
          totalEmployees,
          totalSalaries,
        })
      } else {
        console.error("Fetched employees data is not an array:", data.data)
      }
    } catch (error) {
      console.error("Error fetching employees data:", error)
    }
  }

  useEffect(() => {
    fetchInventoryData()
    fetchEmployeesData()
  }, [])

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <h2 className="h2-title">Inventory Data</h2>
      <div className="dashboard-data-container">
        <div className="inventory-data-container">
          <span className="subtitle">Number of Products</span>
          <span>{inventoryData.totalProducts}</span>
        </div>
        <div className="inventory-data-container">
          <span className="subtitle">Available Products</span>
          <span>{inventoryData.availableProducts}</span>
        </div>
        <div className="inventory-data-container">
          <span className="subtitle">Not Available Products</span>
          <span>{inventoryData.notAvailableProducts}</span>
        </div>
      </div>
      
      <h2 className="h2-title">Employees Data</h2>
      <div className="dashboard-data-container">
        <div className="employees-data-container">
          <span className="subtitle">Number of Employees</span>
          <span>{employeesData.totalEmployees}</span>
        </div>
        <div className="employees-data-container">
          <span className="subtitle">Total Salary Costs</span>
          <span>${employeesData.totalSalaries.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
