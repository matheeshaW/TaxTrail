import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * Prevents logged-in users from accessing login/register
 */
export default function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}