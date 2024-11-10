import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import {
  Landing,
  AddCompany,
  JoinCompany,
  Company,
  Home,
  Login,
  Register,
  RecoveryPassword,
  SetNewPassword,
} from "./screens/index.js"

import NotFound from "./components/NotFound.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} /> 
      <Route path="/landing" element={<Landing />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/recovery-password" element={<RecoveryPassword />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />

      <Route path="/home" element={<Home />} />
      
      <Route path="/add-company" element={<AddCompany />} />
      <Route path="/join-company" element={<JoinCompany />} />
      <Route path="/company/*" element={<Company />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
