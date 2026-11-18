import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data.user || data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data.user;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);