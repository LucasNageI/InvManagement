import React from 'react'
import { AddRole, Inventory, Employees, Dashboard } from '../components/index.js'
import '../styles/screen_styles/Home.css'


const Home = () => {
  return (
    <div>
      <AddRole />
      <Inventory />
      <Employees />
      <Dashboard />
    </div>
  )
}

export default Home