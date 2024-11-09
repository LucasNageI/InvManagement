import React from "react"
import { Routes, Route } from "react-router-dom"
import Login from "./screens/Login"
import Register from "./screens/Register"
import NotFound from "./screens/NotFound"
import Home from "./screens/Home"
import { RecoveryPassword } from "./screens/RecoveryPassword"
import { SetNewPassword } from "./screens/SetNewPassword"

function App() {
  return (
    <div>
      <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/home/*" element={<Home />} />

            <Route path="/recovery-password" element={<RecoveryPassword />} />
            <Route path="/set-new-password" element={<SetNewPassword />} />

            <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
