import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Protected Route Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page with return path.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @param {string} [props.requiredRole] - Optional role required to access the route
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { hasRole, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (requiredRole) {
    const hasRequiredRole = hasRole(requiredRole);
    
    if (!hasRequiredRole) {
      const userRole = localStorage.getItem("userRole");
      const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute; 