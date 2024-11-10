import React, { useState } from 'react'
import '../styles/screen_styles/SetNewPassword.css'
import { verifyPasswords } from '../utils/verifyPasswords'
import { passwordVerification } from '../utils/passwordVerification'
import { Link } from 'react-router-dom'

const SetNewPassword = () => {

    const [errorMessage, setErrorMessage] = useState('')
    const [errorClass, setErrorClass] = useState('no-error')

    const handleSubmit = (event) => {
        event.preventDefault()

        const password = event.target.password.value
        const confirm_password = event.target['confirm-password'].value

        if (!passwordVerification(password)) {
            setErrorMessage("At least 8 Characters, Uppercase, Lowercase, Number, !@#$%^&*_");
            setErrorClass('form-error')
        } else if (!verifyPasswords(password, confirm_password)) {
            setErrorMessage("Passwords do not match");
            setErrorClass('form-error')
        } else {
            console.log("All validations passed, form submitted successfully.")
            setErrorMessage("")
            setErrorClass('no-error')
        }


    }

  return (
    <main className='set-new-password-container'>
        <h1 className='h1-title set-new-password-title'>Set New Password</h1>
        <form onSubmit={handleSubmit} className='form'>
            <div className='form-input-container'>
                <label className='form-labels' htmlFor="password">New password</label>
                <input className='form-inputs' type="password" id="password" name="password" required />
            </div>
            <div className='form-input-container'>
                <label className='form-labels' htmlFor="password">Confirm new password</label>
                <input className='form-inputs' type="password" id="confirm-password" name="confirm-password" required />
            </div>
            <div className={errorClass}>
                <p>{errorMessage}</p>
            </div>
            <div className='form-links'>
                <Link to="/login" className='form-link'>Back to login form</Link>
            </div>
            <button className='form-submit-button' type="submit">Done</button>
        </form>
    </main>

  )
}

export default SetNewPassword