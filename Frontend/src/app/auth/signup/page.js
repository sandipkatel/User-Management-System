"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SignupForm from "@/components/auth/signup-form";

export default function SignUp() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Navigation header */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleGoHome}
          className="flex items-center text-gray-700 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Home</span>
        </button>
      </div>
      <SignupForm />
    </div>
  );
}
