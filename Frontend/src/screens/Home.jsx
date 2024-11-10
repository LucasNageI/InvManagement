import React from "react";
import Header from "../components/Home/Header.jsx";
import Companies from "../components/Home/Companies.jsx";
import { Link } from "react-router-dom";
import "../styles/screen_styles/Home.css";

const companies_array_exapample = [
  {
    id: 1,
    business_name: "Company 1",
    business_key: "xxx-xxx-xxx",
    business_email: "mV3R9@example.com",
    business_password: "hashed_password",
    creation_date: "2022-01-01",
    inventory: {},
    employees: {},
  },
  {
    id: 2,
    business_name: "Company 2",
    business_key: "xxx-xxx-xxx",
    business_email: "mV3R9@example.com",
    business_password: "hashed_password",
    creation_date: "2022-01-01",
    inventory: {},
    employees: {},
  },
  {
    id: 3,
    business_name: "Company 3",
    business_key: "xxx-xxx-xxx",
    business_email: "mV3R9@example.com",
    business_password: "hashed_password",
    creation_date: "2022-01-01",
    inventory: {},
    employees: {},
  },
];
const Home = () => {
  return (
    <div className="home-container">
      <Header />

      <h1 className="h1-title">Welcome Back!</h1>
      <div className="companies-container">
        <div className="companies-title-container">
          <span className="companies-title">Your Companies</span>
        </div>
        <div>
          <Companies companies={companies_array_exapample} />
        </div>
        <div className="company">
          <div className="info-container">
            <span>New Company</span>
            <span>Not created</span>
          </div>
          <div>
            <Link to="/add-company">
              <button className="launch-btn">Create</button>
            </Link>
          </div>
        </div>
        <div>
          <Link to="/add-company"></Link>
        </div>
      </div>
      <div />
    </div>
  );
};

export default Home;
