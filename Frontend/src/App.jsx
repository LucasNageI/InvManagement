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
  WaitingToVerifyEmail,
  ResendEmail,
  EmailVerified,
} from "./screens/index.js"

import NotFound from "./components/NotFound.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<Landing />} />

      <Route path="/register" element={<Register />} />
      <Route path="/waiting-to-verify-email" element={<WaitingToVerifyEmail />}/>
      <Route path="/resend-email" element={<ResendEmail />} />
      <Route path="/email-verified" element={<EmailVerified />} />

      <Route path="/login" element={<Login />} />

      <Route path="/recovery-password" element={<RecoveryPassword />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />

      <Route path="/home" element={ <PrivateRoute> <Home /> </PrivateRoute> }/>
      <Route path="/add-company" element={<PrivateRoute><AddCompany /></PrivateRoute>} />
      <Route path="/join-company" element={<PrivateRoute><JoinCompany /></PrivateRoute>} />
      <Route path="/company/:company_id/*" element={<PrivateRoute><Company /></PrivateRoute>} />


      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App