import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - SMMS",
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
          <a href="/dashboard/admin" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
            View →
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-2">Mentor Dashboard</h3>
          <a href="/dashboard/mentor" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
            View →
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-2">Student Dashboard</h3>
          <a href="/dashboard/student" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
            View →
          </a>
        </div>
      </div>
    </div>
  );
}
