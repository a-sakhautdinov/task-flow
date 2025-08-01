import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Unauthenticated Layout Component
 * 
 * Wrapper for unauthenticated users without header and footer.
 * Used for public routes like login, signup, and landing page.
 */
const UnauthenticatedLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default UnauthenticatedLayout; 