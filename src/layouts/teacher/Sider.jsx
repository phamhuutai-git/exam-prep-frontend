// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import "../../assets/styles/Sider.css";
// import logo from "../../assets/images/logo.png";

// const Sider = () => {
//   const location = useLocation();

//   return (
//     <aside className="sider">
//       <div className="sider-content">
//         <div className="sider-logo">
//           <img src={logo} alt="Logo" className="logo-img" />
//           <span className="logo-text">Quiz</span>
//         </div>

//         <nav className="sider-menu">
//           <Link
//             to="/teacher"
//             className={`menu-item ${location.pathname === "/teacher" ? "active" : ""}`}
//           >
//             Dashboard
//           </Link>

//           <Link
//             to="/teacher/exams"
//             className={`menu-item ${location.pathname === "/teacher/exams" ? "active" : ""}`}
//           >
//             Exams
//           </Link>

//           <Link
//             to="/teacher/questions"
//             className={`menu-item ${location.pathname === "/teacher/questions" ? "active" : ""}`}
//           >
//             Questions
//           </Link>

//           <Link
//             to="/teacher/students"
//             className={`menu-item ${location.pathname === "/teacher/students" ? "active" : ""}`}
//           >
//             Students
//           </Link>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default Sider;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBook,
  faChalkboardUser,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";

const adminMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    path: "/teacher",
    icon: faChartLine,
  },
  {
    id: 2,
    title: "Exams",
    path: "/teacher/exams",
    icon: faBook,
  },
  {
    id: 3,
    title: "Questions",
    path: "/teacher/questions",
    icon: faCircleQuestion,
  },
  {
    id: 4,
    title: "Students",
    path: "/teacher/students",
    icon: faChalkboardUser,
  },
  {
    id: 5,
    title: "Exam Classes",
    path: "/teacher/exam-classes",
    icon: faChalkboardUser,
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

