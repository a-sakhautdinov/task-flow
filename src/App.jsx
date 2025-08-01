/**
 * Main Application Component
 * 
 * Serves as the root component for the TaskFlow application, handling routing,
 * authentication protection, and layout structure. Implements a comprehensive
 * routing system with protected routes and role-based access control.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React from "react";
import { RouterProvider } from "react-router-dom";

// Router Configuration
import { router } from "./config/routes";

// Context Providers
import AuthProvider from "./contexts/AuthContext";
import NotificationProvider from "./contexts/NotificationContext";

/**
 * Main App Component
 * 
 * Defines the application's routing structure and wraps the app with necessary providers.
 */
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
