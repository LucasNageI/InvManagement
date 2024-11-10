import React, { useState } from 'react'
import '../styles/screen_styles/RecoveryPassword.css'
import { Link } from 'react-router-dom'
import { emailVerification } from '../utils/emailVerification'

const RecoveryPassword = () => {

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorClass, setErrorClass] = useState('no-error')

    const handleSubmit = (event) => {
        const email = event.target.email.value
        event.preventDefault()
        setErrorMessage(emailVerification(email))

        if (emailVerification(email)) {
            setErrorMessage('')
            setErrorClass('no-error')
            setSuccessMessage('Email sent successfully')
        } else {
            setErrorClass('form-error')
            setSuccessMessage('')
            setErrorMessage('Invalid email')
        }
    }

  return (
    <main className='recovery-password-container'>
        <h1 className='h1-title recovery-password-title'>Recovery Password</h1>
        <form onSubmit={handleSubmit} className='form'>
            <div className='form-input-container'>
                <label className='form-labels' htmlFor="email">Email Address:</label>
                <input className='form-inputs' autoComplete='off' type="email" id="email" name="email" />
            </div>
            <div className='email-sent-container'>
                <p className='email-sent-message'>{successMessage}</p>
            </div>
            <div className={errorClass}>
                <p>{errorMessage}</p>
            </div>
            <div className='form-links'>
                <Link to="/login" className='form-link'>Back to login form</Link>
            </div>
            <button className='form-submit-button' type="submit">Send Email</button>
        </form>
    </main>
  )
}

export default RecoveryPassword