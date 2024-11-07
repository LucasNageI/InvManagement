import React from 'react'
import '../styles/AddRole.css'

const AddRole = () => {
  return (
    <main className='addrole-container'>
    <h1 className='h1-title'>Assign Role</h1>
    <form>
        <div className='login-input-container'>
            <label htmlFor='email'>User Email:</label>
            <input type='text' id='email' name='email' required />
        </div>
        <div className='login-input-container'>
            <label htmlFor='role'>Role:</label>
            <select id='role' name='role' required>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
                <option value='employee'>Employee</option>

            </select>
        </div>
        <button type='submit'>Assign Role</button>
    </form>
</main>
  )
}

export default AddRole