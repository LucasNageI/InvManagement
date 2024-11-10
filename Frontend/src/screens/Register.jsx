import React from "react";
import "../styles/screen_styles/Register.css";
import { useState } from "react";
import { emailVerification } from "../utils/emailVerification";
import { passwordVerification } from "../utils/passwordVerification";
import { verifyPasswords } from "../utils/verifyPasswords";
import { usernameVerification } from "../utils/usernameVerification";
import { Link } from "react-router-dom";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorClass, setErrorClass] = useState('no-error')

  const handleSubmit = (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value; //8 digitos minimo, solo caracteres como !@#$%^&*_, mayusculas, minusculas y numeros
    const confirm_password = event.target["confirm-password"].value;

    const isUsernameValid = usernameVerification(username);
    const isEmailValid = emailVerification(email);
    const isPasswordValid = passwordVerification(password);
    const isSamePassword = verifyPasswords(password, confirm_password);

    if (!isUsernameValid) {
      setErrorMessage("Invalid username");
      setErrorClass('form-error')
    } else if (!isEmailValid) {
      setErrorMessage("Invalid email");
      setErrorClass('form-error')
    } else if (!isPasswordValid) {
      setErrorMessage(
        "At least 8 Characters, Uppercase, Lowercase, Number, !@#$%^&*_"
      )
      setErrorClass('form-error');
    } else if (!isSamePassword) {
      setErrorMessage("Passwords do not match");
      setErrorClass('form-error')
    } else {
      console.log("All validations passed, form submitted successfully.");
      setErrorMessage("");
      setErrorClass('no-error')
    }
  };

  return (
    <main className="register-container">
      <h1 className="h1-title">Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-input-container">
          <label className="form-labels">Username:</label>
          <input className="form-inputs" autoComplete="off" type="username" name="username" />
        </div>
        <div className="form-input-container">
          <label className="form-labels">Email Address:</label>
          <input className="form-inputs" autoComplete="off" type="text" name="email" />
        </div>
        <div className="form-input-container">
          <label className="form-labels">Password:</label>
          <input className="form-inputs" autoComplete="off" type="password" name="password" />
        </div>
        <div className="form-input-container">
          <label className="form-labels">Confirm password:</label>
          <input
            className="form-inputs"
            autoComplete="off"
            type="password"
            name="confirm-password"
          />
        </div>
        <div className={errorClass}>
            <i className="bi bi-exclamation-triangle-fill"></i>
            <p>{errorMessage}</p>
        </div>
        <div className="form-links">
          <Link to="/login" className="form-link">Already have an account</Link>
        </div>
        <button className="form-submit-button" type="submit">
          Sign up
        </button>
      </form>
    </main>
  );
};
export default Register;
