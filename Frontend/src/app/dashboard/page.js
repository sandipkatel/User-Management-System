
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from "@/endpoints/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, logout} = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    is_active: true,
    is_superuser: false,
  });
  const router = useRouter();

  // Fetch all users if superuser
  useEffect(() => {
    const fetchUsers = async () => {
      if (user && user.is_superuser) {
        try {
          setIsLoading(true);
          const response = await apiGetUsers();
          setUsers(response);
          setError(null);
        } catch (err) {
          setError("Failed to fetch users. " + err.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchUsers();
    }
  }, [user, loading]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      email: user.email,
      full_name: user.full_name || "",
      is_active: user.is_active,
      is_superuser: user.is_superuser,
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiDeleteUser(userId)
        // Update the users list after deletion
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        setError("Failed to delete user. " + err.message);
      }
    }
  };

  const handleUpdate = async (userId) => {
    try {
      const updatedUser = await apiUpdateUser(userId, formData);
        
      setUsers(
        users.map((user) => (user.id === userId ? updatedUser : user))
      );
  
      setEditingUser(null);
      setError(null);
    } catch (err) {
      setError("Failed to update user. " + (err.detail || err.message || "Unknown error"));
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Navigation header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleGoHome}
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Home</span>
        </button>
        
        <button 
          onClick={logout}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Log out</span>
        </button>
      </div>

      {!user?.is_superuser ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
          <p className="text-gray-600">
            Hello {user?.full_name || user?.email}, welcome to your personal
            dashboard. Here you can manage your account settings and view your
            activity.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">User Management Dashboard</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        user.full_name || "—"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <span>Active</span>
                        </div>
                      ) : (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_superuser"
                            checked={formData.is_superuser}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <span>Superuser</span>
                        </div>
                      ) : (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_superuser
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.is_superuser ? "Superuser" : "User"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingUser === user.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleUpdate(user.id)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
