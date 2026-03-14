import React, { useContext } from "react";
import { Dropdown, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faKey,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/Header.css";

const Header = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    // Xóa tất cả thông tin user trong localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");

    // Gọi logout từ AuthContext để cập nhật state
    logout();

    message.success("Đăng xuất thành công!");
    // Chuyển về trang login
    window.location.href = "/";
  };

  const menuItems = [
    {
      key: "profile",
      icon: <FontAwesomeIcon icon={faUser} />,
      label: "Cập nhật thông tin",
    },
    {
      key: "password",
      icon: <FontAwesomeIcon icon={faKey} />,
      label: "Đổi mật khẩu",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="header">
      <div className="header-left"></div>

      <div className="header-right">
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="user-info">
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span className="user-name">Admin</span>
            <FontAwesomeIcon icon={faCog} className="dropdown-icon" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
export default Header;
