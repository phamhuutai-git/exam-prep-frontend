// Quản lý trạng thái đăng nhập (login/logout) và role của người dùng 
// cho toàn bộ ứng dụng React thông qua Context API.
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  const login = (userRole, userInfo = null, accessToken = null) => {
    setIsLoggedIn(true);
    setRole(userRole);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', userRole);
    
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    localStorage.setItem('userRole', userRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    
    // Xóa tất cả thông tin user trong localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

