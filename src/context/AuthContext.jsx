// Quản lý trạng thái đăng nhập (login/logout) và role của người dùng
// cho toàn bộ ứng dụng React thông qua Context API.
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("accessToken") !== null,
  );

  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const login = (userRole, token, userInfo = null) => {
    setIsLoggedIn(true);
    setRole(userRole);

    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", userRole);

    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
