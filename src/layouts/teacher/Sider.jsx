import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartLine, 
  faBook, 
  faChalkboardUser,
  faQuestion
} from '@fortawesome/free-solid-svg-icons'
import '../../assets/styles/Sider.css'
import logo from '../../assets//images/logo.png'

const adminMenuItems = [
  { 
    id: 1, 
    title: 'Dashboard', 
    path: '/teacher',
    icon: faChartLine 
  },
  { 
    id: 2, 
    title: 'Quản lý đề thi', 
    path: '/teacher/users',
    icon: faBook 
  },
  { 
    id: 3, 
    title: 'Quản lý câu hỏi', 
    path: '/teacher/classes',
    icon: faQuestion
  },
  { 
    id: 4, 
    title: 'Gán đề thi cho lớp', 
    path: '/teacher/assign-teacher',
    icon: faChalkboardUser 
  },
]

const Sider = () => {
  return (
    <div className="sider">
      <h2>Teacher Sider</h2>
    </div>
  );
};
export default Sider;

