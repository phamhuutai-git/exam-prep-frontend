import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartLine, 
  faClipboardList, 
  faHeart 
} from '@fortawesome/free-solid-svg-icons'
import '../../assets/styles/Sider.css'
import logo from '../../assets/images/logo.png'

const studentMenuItems = [
  { 
    id: 1, 
    title: 'Dashboard', 
    path: '/student',
    icon: faChartLine 
  },
  { 
    id: 2, 
    title: 'Thi thử',
    path: '/student/bai-thi-luyen-tap',
    icon: faClipboardList 
  },
  { 
    id: 3, 
    title: 'Thi thật',
    path: '/student/bai-thi',
    icon: faClipboardList 
  },
  { 
    id:4, 
    title: 'Lịch sử thi thử',
    path: '/student/lich-su-luyen-tap',
    icon: faClipboardList 
  },
  { 
    id:5, 
    title: 'Lịch sử thi thật', 
    path: '/student/lich-su-thi',
    icon: faClipboardList 
  },

  { 
    id: 5, 
    title: 'Đề thi yêu thích', 
    path: '/student/de-thi-yeu-thich',
    icon: faHeart 
  },
]

const Sider = () => {
  const location = useLocation()

  return (
    <aside className="sider">
      <div className="sider-content">
        <div className="sider-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Quiz</span>
        </div>

        <nav className="sider-menu">
          {studentMenuItems.map((item) => (
            <Link 
              key={item.id} 
              to={item.path} 
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
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
  )
}

export default Sider;