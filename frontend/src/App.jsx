import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import ProtectedRoute from "./components/Common/ProtectedRoute";
import PublicRoute from "./components/Common/PublicRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;