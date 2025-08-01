import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Auth Redirect Component
 * 
 * Redirects authenticated users away from public pages (like login/signup)
 * to their appropriate dashboard based on their role.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when not authenticated
 */
const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    const userRole = localStorage.getItem("userRole");
    const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthRedirect; 