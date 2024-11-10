import React from "react";
import { Link } from "react-router-dom";
import "../../styles/component_styles/Home/Header.css";    

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img className="header-logo" src="./open-box-white.svg" alt="InvManagement Logo" />
        <span className="header-title">InvManagement</span>
      </div>
      <nav className="header-nav">
        <Link to="/join-company"><button className="header-sign-up">Join Company </button></Link>
        <Link to="/add-company"><button className="header-log-in">Add Company</button></Link>
      </nav>
    </header>
  );
};

export default Header;
