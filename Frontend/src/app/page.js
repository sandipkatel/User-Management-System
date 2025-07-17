"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to LOCUS
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A comprehensive software fellows management platform designed to provide seamless
          authentication and user experience.
        </p>

        <div className="flex justify-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                className="bg-gray-200 hover:bg-gray-300 text-blue-800 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Edit Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gray-200 hover:bg-gray-300 text-blue-800 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
          <p className="text-gray-600">
            Advanced security measures to protect user accounts and data.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Fellows Management</h3>
          <p className="text-gray-600">
            Easy profile management and customization options.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Fast Performance</h3>
          <p className="text-gray-600">
            Optimized for speed and smooth user experience.
          </p>
        </div>
      </div>

      {isLoggedIn && (
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name || "User"}!
          </h2>
          <p className="text-gray-600 mb-6">
            You're logged in and ready to explore your dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
