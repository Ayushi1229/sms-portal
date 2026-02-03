"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

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
          
          <div className="text-sm text-gray-600">
            👤 User Profile
          </div>
        </div>
      </div>
    </nav>
  );
}
