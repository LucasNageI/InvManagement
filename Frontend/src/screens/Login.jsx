import React, { useState } from 'react'
import '../styles/screen_styles/Login.css'
import { emailVerification } from '../utils/emailVerification'
import { passwordVerification } from '../utils/passwordVerification'
import { Link } from "react-router-dom"

const Login = () => {

    const [errorMessage, setErrorMessage] = useState('')
    const [errorClass, setErrorClass] = useState('no-error')

    const handleSubmit = (event) => {
        event.preventDefault()
        const email = event.target.email.value
        const password = event.target.password.value //8 digitos minimo, solo caracteres como !@#$%^&*_, mayusculas, minusculas y numeros

        const isEmailValid = emailVerification(email)
        const isPasswordValid = passwordVerification(password)

        
        if (!isEmailValid && !isPasswordValid) {
            setErrorMessage('Invalid email and password')
            setErrorClass('form-error')
        } else if (!isEmailValid) {
            setErrorMessage('Invalid email')
            setErrorClass('form-error')
        } else if (!isPasswordValid) {
            setErrorMessage("At least 8 Characters, Uppercase, Lowercase, Number, !@#$%^&*_");
            setErrorClass('form-error')
        } else {
            console.log('Login successful')
            setErrorMessage('')
            setErrorClass('no-error')
        }
          
    }

  return (
    <main className='login-container'>
        <h1 className='h1-title'>Member Login</h1>
        <form className='form' onSubmit={handleSubmit}>
            <div className='form-inputs-container'>
                <div className='form-input-container'>
                    <label className='form-labels' >Email:</label>
                    <input className='form-inputs' autoComplete="off" type="text" name="email" />
                </div>
                <div className='form-input-container'>
                    <label className='form-labels' >Password:</label>
                    <input className='form-inputs' autoComplete="off" type="password" name="password" />
                </div>
            </div>
            <div className={errorClass}>
                <i className="bi bi-exclamation-triangle-fill"></i>
                <p>{errorMessage}</p>
            </div>
            <div className='form-links'>
                <Link to="/register" className='form-link'>Don't have account?</Link>
                <Link to="/recovery-password" className='form-link'>Forgot password?</Link>
            </div>
            <button className='form-submit-button' type="submit">Login</button>
        </form>
    </main>
  )
}
export default Login