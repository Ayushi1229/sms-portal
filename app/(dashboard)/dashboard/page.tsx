import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview - SMMS",
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="text-3xl">👨‍🎓</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Mentors</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="text-3xl">👨‍🏫</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to SMMS</h2>
        <p className="text-gray-600">
          Student Mentoring Management System - Use the navigation menu to access different sections.
        </p>
      </div>
    </div>
  );
}
