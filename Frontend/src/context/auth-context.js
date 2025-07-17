"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { apiLogin, apiCurrentUser, apiLogout } from "@/endpoints/api";
import { setLoginAttempt, isAuthenticated, setAccessToken } from "@/endpoints/auth";

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Normally true
  const router = useRouter();
  const authCheckCompleted = useRef(false);

  // Check user authentication on mount only once
  useEffect(() => {
    // Skip if we've already checked auth
    if (authCheckCompleted.current) return;

    const checkUserAuthentication = async () => {
      try {
        if (!authCheckCompleted.current && isAuthenticated()) {
          const userData = await apiCurrentUser();
          setUser(userData);
          authCheckCompleted.current = true;
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuthentication();
  }, []);

  // Login handler
  const login = async (credentials) => {
    try {
      setLoginAttempt(true);
      // apiLogin returns access token, not user data
      const response = await apiLogin(credentials);

      // Store the access token in memory for future requests
      if (response && response.access_token) {
        setAccessToken(response.access_token);
      }

      // After successful login, fetch the current user data
      const userData = await apiCurrentUser();
      setUser(userData);
      setLoginAttempt(false);
      router.push("/dashboard");
      return userData;
    } catch (error) {
      setLoginAttempt(false);
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await apiLogout();
      setAccessToken(null);
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      setError("Failed to log out. " + error.message);
    }
  };

  // Context value
  const contextValue = {
    user,
    setUser,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
