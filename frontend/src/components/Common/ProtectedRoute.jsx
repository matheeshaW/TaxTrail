import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * Protects routes from unauthorized access
 * Optionally restricts by role (Admin / Public)
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role check (if provided)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}