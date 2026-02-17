"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { RoleNames } from "@/lib/auth/permissions";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const userName = user?.profile 
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email?.split("@")[0] || "User";
  
  const userRole = user ? RoleNames[user.roleId] || "User" : "";

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
            SMMS
          </Link>
          <span className="text-sm text-gray-500">Student Mentoring Management System</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">🔍 Search</div>
          
          <Link href="/notifications" className="text-gray-600 hover:text-gray-900">
            🔔 <span className="text-xs bg-red-500 text-white px-1 rounded-full">3</span>
          </Link>
          
          {/* User Profile Dropdown */}
          {!isLoading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium">{userName}</div>
                  <div className="text-xs text-gray-500">{userRole}</div>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="font-semibold text-gray-900">{userName}</div>
                    <div className="text-sm text-gray-600">{user?.email}</div>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                        {userRole}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          )}
        </div>
      </div>
    </nav>
  );
}
