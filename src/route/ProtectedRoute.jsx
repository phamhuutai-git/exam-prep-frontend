// Chặn người chưa đăng nhập vào trang hệ thống vd: /admin,/teacher,/student
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  // If allowedRoles is specified, check if user has correct role
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their respective dashboard based on role
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    } else if (role === 'student') {
      return <Navigate to="/student" replace />;
    }
    // If role is unknown, logout and redirect to login
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
