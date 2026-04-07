import { createContext, useState, useCallback } from "react";
import API from "../services/api";

export const AuthContext = createContext();
const USER_STORAGE_KEY = "auth_user";

// Decode the JWT payload without a library — the token is not verified here
const parseJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const buildUserFromPayload = (payload) => {
  if (!payload) return null;

  const id = payload.id || payload._id || payload.sub || null;
  const name = payload.name || null;
  const email = payload.email || null;
  const role = payload.role || null;

  if (!id && !name && !email && !role) return null;

  return { id, name, email, role };
};

// Re-hydrate user from a stored token, or return null if missing/expired.
const getUserFromToken = (token) => {
  if (!token) return null;
  const payload = parseJwt(token);
  if (!payload) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return buildUserFromPayload(payload);
};

const getUserFromAuthResponse = (responseData, token) => {
  if (responseData?.user) {
    return responseData.user;
  }

  return getUserFromToken(token);
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    return parsed;
  } catch {
    return null;
  }
};

const getInitialUser = () => {
  const token = localStorage.getItem("token");
  const tokenUser = getUserFromToken(token);
  const storedUser = getStoredUser();

  if (storedUser && tokenUser) {
    return {
      ...storedUser,
      id: tokenUser.id || storedUser.id || null,
      role: tokenUser.role || storedUser.role || null,
      name: storedUser.name || tokenUser.name || null,
      email: storedUser.email || tokenUser.email || null,
    };
  }

  return storedUser || tokenUser;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shared helper so login and register stay DRY.
  const applyCredentials = (newToken, userData) => {
    const normalizedUser = userData || getUserFromToken(newToken);

    localStorage.setItem("token", newToken);

    if (normalizedUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }

    setToken(newToken);
    setUser(normalizedUser);
  };

  // login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token: newToken } = response.data;
      const userData = getUserFromAuthResponse(response.data, newToken);

      if (!newToken) {
        throw new Error("Authentication token missing from login response");
      }

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
      const { token: newToken } = response.data;
      const userData = getUserFromAuthResponse(response.data, newToken);

      if (!newToken) {
        throw new Error(
          "Authentication token missing from registration response",
        );
      }

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
    localStorage.removeItem(USER_STORAGE_KEY);
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
