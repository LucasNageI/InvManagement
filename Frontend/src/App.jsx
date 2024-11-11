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

const companies_array_exapample = [
    {
      id: 1,
      business_name: "Company 1",
      business_key: "xxx-xxx-xxx",
      business_email: "mV3R9@example.com",
      business_password: "hashed_password",
      creation_date: "2022-01-01",
      inventory: {},
      employees: {},
    },
    {
      id: 2,
      business_name: "Company 2",
      business_key: "xxx-xxx-xxx",
      business_email: "mV3R9@example.com",
      business_password: "hashed_password",
      creation_date: "2022-01-01",
      inventory: {},
      employees: {},
    },
    {
      id: 3,
      business_name: "Company 3",
      business_key: "xxx-xxx-xxx",
      business_email: "mV3R9@example.com",
      business_password: "hashed_password",
      creation_date: "2022-01-01",
      inventory: {},
      employees: {},
    },
  ];

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
      <Route path="/company/:company_id/*" element={<Company companies={companies_array_exapample} />} />


      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
