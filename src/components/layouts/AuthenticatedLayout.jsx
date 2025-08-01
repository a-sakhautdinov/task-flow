import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

/**
 * Authenticated Layout Component
 * 
 * Wrapper for authenticated users that includes header and footer.
 * Used for all protected routes where users need to be logged in.
 */
const AuthenticatedLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AuthenticatedLayout; 