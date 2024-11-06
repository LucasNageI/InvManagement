import React from "react"
import { Routes, Route } from "react-router-dom"
import Inventory from "./screens/Inventory"
import Employees from "./screens/Employees"
import Dashboard from "./screens/Dashboard"
import Login from "./screens/Login"
import Register from "./screens/Register"
import AddRole from "./screens/AddRole"
import NotFound from "./screens/NotFound"

function App() {
  return (
    <div>
      <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/inventory" element={<Inventory />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addRole" element={<AddRole />} />

            <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
