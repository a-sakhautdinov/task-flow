import { createBrowserRouter } from "react-router-dom";

// Layout Components
import AuthenticatedLayout from "../components/layouts/AuthenticatedLayout";
import UnauthenticatedLayout from "../components/layouts/UnauthenticatedLayout";

// Routing Components
import ProtectedRoute from "../components/routing/ProtectedRoute";
import AuthRedirect from "../components/routing/AuthRedirect";

// Public Pages
import Landing from "../pages/Landing";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";

// Admin Pages
import Dashboard from "../pages/AdminPages/Dashboard";
import Users from "../pages/AdminPages/Users";
import ManageUsers from "../pages/AdminPages/ManageUsers";
import ManageTasks from "../pages/AdminPages/ManageTasks";
import Settings from "../pages/AdminPages/Settings";
import UserLogPage from "../pages/AdminPages/UserLogPage";

// User Pages
import UserDashboard from "../pages/UserPages/Dashboard";
import UserPage from "../pages/UserPages/UserPage";
import NotificationsPage from "../pages/UserPages/NotificationsPage";
import CalendarPage from "../pages/UserPages/CalendarPage";
import ProfilePage from "../pages/UserPages/ProfilePage";

// Feature Components
import TaskFilter from "../components/tasks/TaskFilter";

/**
 * Application Router Configuration
 * 
 * Defines all routes using createBrowserRouter with two main layout wrappers:
 * - UnauthenticatedLayout: For public pages (no header/footer)
 * - AuthenticatedLayout: For protected pages (with header/footer)
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <UnauthenticatedLayout />,
    children: [
      {
        index: true,
        element: (
          <AuthRedirect>
            <Landing />
          </AuthRedirect>
        ),
      },
      {
        path: "login",
        element: (
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        ),
      },
      {
        path: "signup",
        element: (
          <AuthRedirect>
            <Signup />
          </AuthRedirect>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <AuthRedirect>
            <ForgotPassword />
          </AuthRedirect>
        ),
      },
      {
        path: "reset-password",
        element: (
          <AuthRedirect>
            <ResetPassword />
          </AuthRedirect>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AuthenticatedLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ManageUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-tasks",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ManageTasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-logs",
        element: (
          <ProtectedRoute requiredRole="admin">
            <UserLogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "task-filter",
        element: (
          <ProtectedRoute requiredRole="admin">
            <TaskFilter />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/user",
    element: <AuthenticatedLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "userpage",
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "calendar",
        element: (
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "task-filter",
        element: (
          <ProtectedRoute>
            <TaskFilter />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Landing />,
  },
]); 