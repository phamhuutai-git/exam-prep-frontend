import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faFileLines,
  faClipboardQuestion,
  faUsers,
  faLayerGroup,
  faChalkboard
 
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";

const adminMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    path: "/teacher",
    icon: faGauge,
  },
  {
    id: 2,
    title: "Quản lý đề thi",
    path: "/teacher/exams",
    icon: faFileLines,
  },
  {
    id: 3,
    title: "Quản lý câu hỏi",
    path: "/teacher/questions",
    icon: faClipboardQuestion,
  },
  {
    id: 4,
    title: "Quản lý danh mục",
    path: "/teacher/category",
    icon: faLayerGroup,
  },
  {
    id: 5,
    title: "Quản lý điểm thi",
    path: "/teacher/students",
    icon: faUsers,
  },
  {
    id: 6,
    title: "Quản lý đề thi theo lớp",
    path: "/teacher/exam-classes",
    icon: faChalkboard,
  },
];

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
          {adminMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="menu-icon">
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span className="menu-text">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};
export default Sider;
