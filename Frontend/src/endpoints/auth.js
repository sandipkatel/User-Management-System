// Auth utilities
import Cookies from "js-cookie";

export const AUTH_TOKEN_NAME =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || "auth_token";

  // Store the access token in memory for the session
let accessToken = null;


// Track if we're in the middle of a login attempt
let isAttemptingLogin = false;

// Expose functions to set/clear the login attempt status
export const setLoginAttempt = (status) => {
  isAttemptingLogin = status;
};

// Get token from storage when module loads
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("accessToken");
}

export const setAccessToken = (token) => {
  accessToken = token;
  
  // Store token in localStorage for persistence
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }
};

export const getAccessToken = () => accessToken;

export const isAuthenticated = () => {
  return !!accessToken;
};

// export const getAuthToken = () => {
//   return Cookies.get(AUTH_TOKEN_NAME);
// };

// export const setAuthToken = (token, options = {}) => {
//   Cookies.set(AUTH_TOKEN_NAME, token, {
//     expires: 1, // 1 day
//     sameSite: "Lax",
//     secure: process.env.NODE_ENV === "production",
//     ...options,
//   });
// };

// export const removeAuthToken = () => {
//   Cookies.remove(AUTH_TOKEN_NAME);
// };

// Check if a user has a specific role
export const hasRole = (user) => {
  if (!user) return false;
  return user.is_superuser;
};

// Check if current user can access admin routes
export const isAdmin = (user) => {
  return hasRole(user);
};

// Parse JWT token (without verification - client-side only)
export const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Extract user data from token
export const getUserFromToken = (token) => {
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded;
};
