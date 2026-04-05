import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 px-6 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Public Budget Dashboard</h1>
          <p className="text-xs text-gray-500">Track tax contributions and regional impact</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-900 sm:block">
            <span className="font-medium">{user?.name || "User"}</span>
            <span className="mx-1 text-blue-400">•</span>
            <span>{user?.role || "Unknown"}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}