"use client";
{
  /*Dashboard Layout*/
}

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated and not still loading
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
    // Check if the user is a superuser
    if (user && user.is_superuser) {
      setIsSuperUser(true);
    }
  }, [isAuthenticated, loading, router, user]);

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, render dashboard layout
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}