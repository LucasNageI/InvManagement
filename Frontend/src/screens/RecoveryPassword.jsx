import React, { useState } from 'react'
import '../styles/screen_styles/RecoveryPassword.css'
import { Link } from 'react-router-dom'
import { emailVerification } from '../utils/emailVerification'

export const RecoveryPassword = () => {

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleSubmit = (event) => {
        const email = event.target.email.value
        event.preventDefault()
        setErrorMessage(emailVerification(email))

        if (errorMessage === '') {
            setSuccessMessage('Email sent')
        }
    }

  return (
    <main className='recovery-password-container'>
        <form onSubmit={handleSubmit} className='recovery-password-form'>
            <h1 className='h1-title'>Recovery Password</h1>
            <div className='recovery-password-input-container'>
                <label className='recovery-password-label' htmlFor="email">Email:</label>
                <input className='email-input' type="email" id="email" name="email" required />
            </div>
            <div className='email-sent-container'>
                <p className='email-sent-message'>{successMessage}</p>
            </div>
            <div className='recovery-password-error'>
                <p className='recovery-password-error-message'>{errorMessage}</p>
            </div>
            <div>
                <Link to="/login">Back to login form</Link>
            </div>
            <button className='recovery-password-submit-button' type="submit">Send Email</button>
        </form>
    </main>
  )
}
