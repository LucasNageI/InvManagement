import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/screen_styles/JoinCompany.css'
import { verifyBusinessKey } from '../utils'

const JoinCompany = () => {

    const [errorMessage, setErrorMessage] = useState('')
    const [errorClass, setErrorClass] = useState('no-error')

    const handleSubmit = (event) => {
        event.preventDefault()
        const business_key = event.target['business_key'].value

        if (!verifyBusinessKey(business_key)) {
            setErrorClass('form-error')
            setErrorMessage('Invalid business key')
        } else {
            setErrorClass('no-error')
            setErrorMessage('') 
            console.log('All validations passed, form submitted successfully.')
        }
    }
  return (
    <main className='join-company-container'>
    <h1 className='h1-title'>Join Company</h1>
    <form onSubmit={handleSubmit} className='form'>
        <div className='form-input-container'>
            <label className='form-labels' htmlFor="business_key">Business Key:</label>
            <input className='form-inputs' autoComplete='off' type="password" id="business_key" name="business_key" />
        </div>
        <div className={errorClass}>
            <p>{errorMessage}</p>
        </div>
        <div className='form-links'>
            <Link to="/add-company" className='form-link'>I want to create a company</Link>
            <Link to="/home" className='form-link'>Back to Home</Link>
        </div>
        <button className='form-submit-button' type="submit">Create</button>
    </form>
</main>
  )
}

export default JoinCompany