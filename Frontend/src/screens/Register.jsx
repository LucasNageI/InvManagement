import React from 'react'
import '../styles/screen_styles/Register.css'
import { useState } from 'react'
import { emailVerification } from '../helpers/emailVerification'
import { passwordVerification } from '../helpers/passwordVerification'
import { verifyPasswords } from '../helpers/verifyPasswords'
import { usernameVerification } from '../helpers/usernameVerification'
import { Link } from "react-router-dom"

const Register = () => {

    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()

        const username = event.target.username.value
        const email = event.target.email.value  
        const password = event.target.password.value //8 digitos minimo, solo caracteres como !@#$%^&*_, mayusculas, minusculas y numeros
        const confirm_password = event.target['confirm-password'].value

        const isUsernameValid = usernameVerification(username)
        const isEmailValid = emailVerification(email)
        const isPasswordValid = passwordVerification(password)
        const isSamePassword = verifyPasswords(password, confirm_password)

        
        if (!isUsernameValid) {
            setErrorMessage("Invalid username");
        } else if (!isEmailValid) {
            setErrorMessage("Invalid email");
        } else if (!isPasswordValid) {
            setErrorMessage("At least 8 Characters, Uppercase, Lowercase, Number, !@#$%^&*_");
        } else if (!isSamePassword) {
            setErrorMessage("Passwords do not match");
        } else {
            console.log("All validations passed, form submitted successfully.");
            setErrorMessage("");
        }
    }

  return (
    <main className='register-container'>
    <h1 className='h1-title'>Register</h1>
    <form className='register-form' onSubmit={handleSubmit}>
        <div className='register-input-container'>
            <label className='register-label'>Username:</label>
            <input className='username-input' type="username" name="username" />
        </div>
        <div className='register-input-container'>
            <label className='register-label'>Email:</label>
            <input className='email-input' type="text" name="email" />
        </div>
        <div className='register-input-container'>
            <label className='register-label'>Password:</label>
            <input className='password-input' type="password" name="password" />
        </div>
        <div className='register-input-container'>
            <label className='register-label'>Confirm password:</label>
            <input className='confirm-password-input' type="password" name="confirm-password" />
        </div>
        <div className='register-error'>
            <p className='register-error-message'>{errorMessage}</p>
        </div>
        <div className='already-have-account'>
            <Link to="/login">Already have an account</Link>
        </div>
        <button className='register-submit-button' type="submit">Sign up</button>
    </form>
</main>
  )
}
export default Register