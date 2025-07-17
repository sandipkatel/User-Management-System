// export default api;
import axios from "axios";
import { setAccessToken, getAccessToken, isAuthenticated } from "@/endpoints/auth";

// For server-side API calls
const apiBaseUrl = process.browser
  ? process.env.NEXT_PUBLIC_API_URL // Browser environment
  : process.env.API_BASE_URL; // Server environment

// Create axios instance
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (isAuthenticated()) {
    config.headers.Authorization = `Bearer ${getAccessToken()}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = new Error(
      error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
    );

    // Add the original response data and status to the error object
    if (error.response) {
      message.status = error.response.status;
      message.data = error.response.data;
      message.originalError = error;
    }

    if (error.response?.status === 401) {
      setAccessToken(null);

      if (typeof window !== "undefined" && !isAttemptingLogin && !isAuthenticated()) {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(new Error(message));
  }
);

// Auth API calls
export const apiLogin = async (credentials) => {
  const formData = new URLSearchParams();
  formData.append("username", credentials.email);
  formData.append("password", credentials.password);

  // Send with x-www-form-urlencoded content type
  const response = await api.post("/auth/login", formData.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response;
};

export const apiLogout = async () => {
  const result = await api.post("/auth/logout");
  return result;
};

export const apiSignup = (userData) => api.post("/auth/signup", userData);
export const apiForgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });
export const apiResetPassword = (token, password) =>
  api.post("/auth/reset-password", { token, password });

// User API calls
export const apiGetUsers = () => api.get("/users");
export const apiCurrentUser = () => api.get("/users/me");
export const apiGetUser = (id) => api.get(`/users/${id}`);
export const apiUpdateUser = (id, user_in) => api.put(`/users/${id}`, user_in);
export const apiDeleteUser = (id) => api.delete(`/users/${id}`);

export default api;
