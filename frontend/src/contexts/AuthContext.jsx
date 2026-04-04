import { createContext, useState, useCallback } from "react";
import API from "../services/api";

export const AuthContext = createContext();

// Decode the JWT payload without a library — the token is not verified here
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Re-hydrate user from a stored token, or return null if missing/expired.
const getUserFromToken = (token) => {
  if (!token) return null;
  const payload = parseJwt(token);
  if (!payload) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  const { id, name, email, role } = payload;
  return { id, name, email, role };
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() =>
    getUserFromToken(localStorage.getItem("token")),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shared helper so login and register stay DRY.
  const applyCredentials = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  // login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      applyCredentials(newToken, userData);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login Failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // register
  const register = useCallback(async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/auth/register", {
        email,
        password,
        name,
      });
      const { token: newToken, user: userData } = response.data;

      applyCredentials(newToken, userData);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // check if user is authenticated
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
