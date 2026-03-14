import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";

const Sider = () => {
  const location = useLocation();

  return (
    <aside className="sider">
      <div className="sider-content">
        <div className="sider-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Quiz</span>
        </div>

        <nav className="sider-menu">
          <Link
            to="/teacher"
            className={`menu-item ${location.pathname === "/teacher" ? "active" : ""}`}
          >
            Dashboard
          </Link>

          <Link
            to="/teacher/exams"
            className={`menu-item ${location.pathname === "/teacher/exams" ? "active" : ""}`}
          >
            Exams
          </Link>

          <Link
            to="/teacher/questions"
            className={`menu-item ${location.pathname === "/teacher/questions" ? "active" : ""}`}
          >
            Questions
          </Link>

          <Link
            to="/teacher/students"
            className={`menu-item ${location.pathname === "/teacher/students" ? "active" : ""}`}
          >
            Students
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sider;
