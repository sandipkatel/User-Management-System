// Auth state hook
"use client";
import { useState } from 'react';
import { useAuthContext } from "@/context/auth-context";

export function useAuth() {
  return useAuthContext();
}

// Custom hook for user profile management
export const useUserProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUserProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    updateUserProfile,
    loading,
    error
  };
};

// Custom hook for form validation
export const useFormValidation = (initialState = {}, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = (callback) => async (event) => {
    event.preventDefault();
    const validationErrors = validate ? validate(values) : {};
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        await callback();
      } catch (error) {
        // Handle submission errors
        setErrors({
          submit: error.message || 'An error occurred'
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    setValues,
    setErrors
  };
};