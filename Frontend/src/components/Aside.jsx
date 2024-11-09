import React from "react";
import { Link } from "react-router-dom";
import "../styles/component_styles/Aside.css";

const Aside = () => {
  return (
    <aside className="aside">
      <nav className="aside-nav">
        <ul className="aside-list">
          <li>
            <span className="aside-role-span">Role: Admin</span>
          </li>
          <li>
            <Link to="inventory" className="link">
              <i className="bi bi-boxes"></i>
              <span className="aside-span">Inventory</span>
            </Link>
          </li>
          <li>
            <Link to="dashboard" className="link">
              <i className="bi bi-info-circle"></i>
              <span className="aside-span">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="employees" className="link">
              <i className="bi bi-person"></i>
              <span className="aside-span">Employees</span>
            </Link>
          </li>
        </ul>
        <ul className="aside-list">
{/*           <li>
            <Link to="profile" className="link">
              <i className="bi bi-person"></i>
              <span className="aside-span">Profile</span>
            </Link>
          </li> */}
          <li>
            <button className="log-out">
              <i className="bi bi-box-arrow-right"></i>
              <span className="aside-span">Log Out</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Aside;
