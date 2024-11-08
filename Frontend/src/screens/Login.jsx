import React, { useState } from 'react'
import '../styles/screen_styles/Login.css'
import { emailVerification } from '../helpers/emailVerification'
import { passwordVerification } from '../helpers/passwordVerification'
import { Link } from "react-router-dom"

const Login = () => {

    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        const email = event.target.email.value
        const password = event.target.password.value //8 digitos minimo, solo caracteres como !@#$%^&*_, mayusculas, minusculas y numeros

        const isEmailValid = emailVerification(email)
        const isPasswordValid = passwordVerification(password)
        
        if (!isEmailValid && !isPasswordValid) {
            setErrorMessage('Invalid email and password')
        } else if (!isEmailValid) {
            setErrorMessage('Invalid email')
        } else if (!isPasswordValid) {
            setErrorMessage("At least 8 Characters, Uppercase, Lowercase, Number, !@#$%^&*_");
        } else {
            console.log('Login successful')
            setErrorMessage('')
        }
          
    }

  return (
    <main className='login-container'>
        <h1 className='h1-title'>Member Login</h1>
        <form className='login-form' onSubmit={handleSubmit}>
            <div className='login-input-container'>
                <label className='login-label'>Email:</label>
                <input className='email-input' type="text" name="email" />
            </div>
            <div className='login-input-container'>
                <label className='login-label'>Password:</label>
                <input className='password-input' type="password" name="password" />
            </div>
            <div className='login-error'>
                <p className='login-error-message'>{errorMessage}</p>
            </div>
            <div className='login-links'>
                <Link to="/register">Don't have account?</Link>
                <Link to="/recovery-password">Forgot password?</Link>
            </div>
            <button className='login-submit-button' type="submit">Login</button>
        </form>
    </main>
  )
}
export default Login