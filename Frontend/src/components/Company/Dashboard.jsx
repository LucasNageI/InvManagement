import React from 'react'
import '../../styles/component_styles/Company/Dashboard.css'

const Dashboard = () => {
  return (
    <div className='dashboard-container'>
        <h1 className='dashboard-title'>Dashboard</h1>
        <h2 className='h2-title'>Inventory Data</h2>
        <div className='dashboard-data-container'>
            <div className="inventory-data-container">
                <span className='subtitle'>Number of Products</span>
                <span>Products.length</span>
            </div>
            <div className="inventory-data-container">
                <span className='subtitle'>Avalible Products</span>
                <span>filtro de productos</span>
            </div>
            <div className="inventory-data-container">
                <span className='subtitle'>Not Avalible Products</span>
                <span>filtro de productos</span>
            </div>
        </div>
        <h2 className='h2-title'>Employees Data</h2>
        <div className='dashboard-data-container'>
            <div className="employees-data-container">
                <span className='subtitle'>Number of Employees</span>
                <span>employees_id.length</span>
            </div>
            <div className="employees-data-container">
                <span className='subtitle'>Costs of Salaries</span>
                <span>suma de salarios</span>
            </div>
        </div>
    </div>
  )
}

export default Dashboard