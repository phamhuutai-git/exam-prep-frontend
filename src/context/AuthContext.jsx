// Quản lý trạng thái đăng nhập (login/logout) và role của người dùng
// cho toàn bộ ứng dụng React thông qua Context API.
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi } from "../services/authService";
import { getCurrentUserApi, updateProfileApi, changePasswordApi } from "../services/userService";
import { toast } from "react-toastify";
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("accessToken")
  );

  const [role, setRole] = useState(null);

  const [user, setUser] = useState(null);

  const [userFullName, setUserFullName] = useState("");

  const [authReady, setAuthReady] = useState(false);



const login = async (credentials) => {
  const res = await loginApi(credentials);
  const loginUser = res.data.data;

  // Save token only
  localStorage.setItem("accessToken", loginUser.token);

  // Update state
  setIsLoggedIn(true);
  setRole(loginUser.role || null);
  setUser(loginUser);
  const fullName = `${loginUser.firstName || ""} ${loginUser.lastName || ""}`.trim();
  setUserFullName(fullName);
  setAuthReady(true);

  // Refresh profile from backend if available
  try {
    const userRes = await getCurrentUserApi();
    const fullUser = userRes.data.data;
    setUser(fullUser);
    const updatedFullName = `${fullUser.firstName || ""} ${fullUser.lastName || ""}`.trim();
    setUserFullName(updatedFullName);
    setRole(fullUser.role || loginUser.role || null);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }

  return loginUser;
};


  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    setUserFullName("");
    setAuthReady(false);
  };

  // Load user on mount if logged in
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token && !user) {
        try {
          const userRes = await getCurrentUserApi();
          const fullUser = userRes.data.data;
          setUser(fullUser);
          const fullName = `${fullUser.firstName || ""} ${fullUser.lastName || ""}`.trim();
          setUserFullName(fullName);
          setRole(fullUser.role || null);
        } catch (error) {
          console.error("Failed to load user:", error);
          logout();
        } finally {
          setAuthReady(true);
        }
      } else {
        setAuthReady(true);
      }
    };
    if (isLoggedIn) {
      loadUser();
    } else {
      setAuthReady(true);
    }
  }, [isLoggedIn, user]);

  const refreshUser = async () => {
    try {
      const userRes = await getCurrentUserApi();
      const fullUser = userRes.data.data;
      setUser(fullUser);
      const fullName = `${fullUser.firstName || ""} ${fullUser.lastName || ""}`.trim();
      setUserFullName(fullName);
      setRole(fullUser.role || null);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  // Hàm cập nhật thông tin user
  const updateUserInfo = async (data) => {
    try {
      const res = await updateProfileApi(data);
      // Giả sử API trả về user data sau khi update
      const updatedUser = res.data.data || res.data;
      setUser(updatedUser);
      const fullName = `${updatedUser.firstName || ""} ${updatedUser.lastName || ""}`.trim();
      setUserFullName(fullName);
      setRole(updatedUser.role || role);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
      throw error;
    }
  };

  // Hàm đổi mật khẩu
  const changePassword = async (data) => {
    try {
      await changePasswordApi(data);
      toast.success("Đổi mật khẩu thành công!");
      // Có thể logout nếu muốn force re-login sau đổi mật khẩu
      // logout();
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        role,
        user,
        userFullName,
        authReady,
        login,
        logout,
        refreshUser,
        updateUserInfo,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

