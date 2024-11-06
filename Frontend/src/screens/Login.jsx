import React from 'react'
import '../styles/Login.css'
import { emailVerification } from '../helpers/emailVerification'
import { passwordVerification } from '../helpers/passwordVerification'

const Login = () => {

    const handleSubmit = (event) => {
        event.preventDefault()
        const email = event.target.email.value
        const password = event.target.password.value //8 digitos minimo, solo caracteres como !@#$%^&*_, mayusculas, minusculas y numeros

        if (emailVerification(email) && passwordVerification(password)) {
            console.log('Login successful')
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
            <button className='login-submit-button' type="submit">Login</button>
        </form>
    </main>
  )
}
export default Login