// Quản lý trạng thái đăng nhập (login/logout) và role của người dùng
// cho toàn bộ ứng dụng React thông qua Context API.
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { loginApi } from "../services/authService";
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("accessToken")
  );

  const [role, setRole] = useState(
    () => localStorage.getItem("role")
  );

/**
 * Logs in the user by calling login API with credentials.
 * Saves token, role, userInfo to localStorage and updates state.
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.emailOrUsername - Email or username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} User data including role, token, username, failCount
 */
const login = async (credentials) => {
  const res = await loginApi(credentials);
  const user = res.data.data;

  // Save to localStorage
  localStorage.setItem("accessToken", user.token);
  localStorage.setItem("role", user.role);
  localStorage.setItem("userInfo", JSON.stringify(user));

  // Update state
  setIsLoggedIn(true);
  setRole(user.role);

  return user;
};


  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};