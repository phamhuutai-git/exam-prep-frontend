import React, { useContext } from 'react';
import { Dropdown, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/Header.css';
import Capnhatthongtin from '../components/modal/auth/Capnhatthongtin';
import Capnhatmatkhau from '../components/modal/auth/Capnhatmatkhau';

const Header = () => {
  const { logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  const handleProfileUpdate = (values) => {
    // TODO: Update user info (localStorage or API)
    console.log('Updated profile:', values);
    localStorage.setItem('userFullName', values.fullName);
    localStorage.setItem('userEmail', values.email);
  };

  const handleChangePassword = async (values) => {
    // NOTE: Backend currently does not support change-password API.
    // This is a temporary local implementation for UI/demo purposes.
    console.log('Change password request:', values);

    // Optionally store the new password locally (NOT secure, only for demo).
    localStorage.setItem('userPassword', values.newPassword);

    // Resolve immediately to close modal and show success message in the modal component.
    return Promise.resolve();
  };

  const handleLogout = () => {
    // Xóa tất cả thông tin user trong localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
    
    // Gọi logout từ AuthContext để cập nhật state
    logout();
    
    message.success('Đăng xuất thành công!');
    // Chuyển về trang login
    window.location.href = '/';
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <FontAwesomeIcon icon={faUser} />,
      label: 'Cập nhật thông tin',
      onClick: () => setIsModalOpen(true)
    },
    {
      key: 'password',
      icon: <FontAwesomeIcon icon={faKey} />,
      label: 'Đổi mật khẩu',
      onClick: () => setIsPasswordModalOpen(true)
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout
    }
  ];

 

  const userFullName = localStorage.getItem('userFullName') || 'Admin';

  return (
    <header className="header">
      <div className="header-left">
        
      </div>
      
      <div className="header-right">
        <Dropdown 
          menu={{ items: menuItems }} 
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="user-info">
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span className="user-name">{userFullName}</span>
            <FontAwesomeIcon icon={faCog} className="dropdown-icon" />
          </div>
        </Dropdown>
        <Capnhatthongtin 
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onUpdate={handleProfileUpdate}
        />
        <Capnhatmatkhau
          open={isPasswordModalOpen}
          onCancel={() => setIsPasswordModalOpen(false)}
          onChangePassword={handleChangePassword}
                   
        />
      </div>
    </header>
  );
};
export default Header;

