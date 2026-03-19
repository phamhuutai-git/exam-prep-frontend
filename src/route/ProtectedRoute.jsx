import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const ProtectedRoute = ({ children, allowedRoles }) => {

  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {

    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "TEACHER") {
      return <Navigate to="/teacher" replace />;
    }

    if (role === "STUDENT") {
      return <Navigate to="/student" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;