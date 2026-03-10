// Chặn người đã đăng nhập vào trang public (vd: Login,ResetPassword)
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If user leaves reset-password page, clear resetEmail from localStorage
    if (location.pathname !== '/reset-password') {
      localStorage.removeItem('resetEmail');
    }
  }, [location]);

  if (isLoggedIn) {
    // Redirect logged-in users to their respective dashboard based on role
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    } else if (role === 'student') {
      return <Navigate to="/student" replace />;
    }
  }

  return children;
};

export default PublicRoute;

