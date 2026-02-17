"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user just registered
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const getRoleDashboard = (roleId: number): string => {
    const dashboardMap: Record<number, string> = {
      1: "/dashboard/admin", // super_admin
      2: "/dashboard/admin", // institutional_admin
      3: "/dashboard/department", // department_admin
      4: "/dashboard/mentor", // mentor
      5: "/dashboard/student", // student
    };
    return dashboardMap[roleId] || "/dashboard";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    
    // Client-side validation for instant feedback
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      // Fast fetch with minimal timeout
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Explicitly include credentials for cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      if (data.success && data.data.user) {
        const redirectUrl = searchParams.get("redirect") || getRoleDashboard(data.data.user.roleId);
        console.log("Redirecting to:", redirectUrl);
        console.log("User role:", data.data.user.roleId);
        
        // Immediate redirect - no delay needed since we're using window.location
        window.location.href = redirectUrl;
      } else {
        setError("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-blue-600 hover:text-blue-700 transition"
          >
            Forgot?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
