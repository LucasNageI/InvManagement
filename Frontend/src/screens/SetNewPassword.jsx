import React, { useState } from 'react'
import '../styles/screen_styles/SetNewPassword.css'
import { verifyPasswords } from '../helpers/verifyPasswords'
import { passwordVerification } from '../helpers/passwordVerification'
import { Link } from 'react-router-dom'

export const SetNewPassword = () => {

    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()

        const password = event.target.password.value
        const confirm_password = event.target['confirm-password'].value

        if (!passwordVerification(password)) {
            setErrorMessage("At least 8 Characters, Uppercase, Lowercase, Number, !@#$%^&*_");
        } else if (!verifyPasswords(password, confirm_password)) {
            setErrorMessage("Passwords do not match");
        } else {
            console.log("All validations passed, form submitted successfully.")
            setErrorMessage("")
        }


    }

  return (
    <main className='set-new-password-container'>
        <form onSubmit={handleSubmit} className='set-new-password-form'>
            <h1 className='h1-title'>Set New Password</h1>
            <div className='set-new-password-input-container'>
                <label className='set-new-password-label' htmlFor="password">New password</label>
                <input className='password-input' type="password" id="password" name="password" required />
            </div>
            <div className='confirm-new-password-input-container'>
                <label className='set-new-password-label' htmlFor="password">Confirm new password</label>
                <input className='password-input' type="password" id="confirm-password" name="confirm-password" required />
            </div>
            <div className='set-new-password-error'>
                <p className='set-new-password-error-message'>{errorMessage}</p>
            </div>
            <div>
                <Link to="/login">Back to login form</Link>
            </div>
            <button className='set-new-password-submit-button' type="submit">Done</button>
        </form>
    </main>

  )
}
