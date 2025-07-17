//  User data fetching hook
"use client";

import { useState, useEffect } from "react";
import {
  apiGetUser,
  apiGetUsers,
  apiUpdateUser,
  apiDeleteUser,
  apiCreateUser,
} from "@/endpoints/api";

export function useUser(userId = null) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch single user by ID
  const fetchUser = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await apiGetUser(id);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || "Failed to fetch user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const usersData = await apiGetUsers();
      setUsers(usersData);
      return usersData;
    } catch (err) {
      setError(err.message || "Failed to fetch users");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update a user
  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await apiUpdateUser(id, userData);

      // Update local state
      if (id === user?.id) {
        setUser(updatedUser);
      }

      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));

      return updatedUser;
    } catch (err) {
      setError(err.message || "Failed to update user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new user
  const createUser = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const newUser = await apiCreateUser(userData);

      // Update users list if we have it
      if (users.length > 0) {
        setUsers((prev) => [...prev, newUser]);
      }

      return newUser;
    } catch (err) {
      setError(err.message || "Failed to create user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await apiDeleteUser(id);

      // Update local state
      setUsers((prev) => prev.filter((u) => u.id !== id));

      if (user?.id === id) {
        setUser(null);
      }

      return true;
    } catch (err) {
      setError(err.message || "Failed to delete user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load user data if userId is provided
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  return {
    user,
    users,
    loading,
    error,
    fetchUser,
    fetchUsers,
    updateUser,
    createUser,
    deleteUser,
  };
}
