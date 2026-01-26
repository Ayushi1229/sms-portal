import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - SMMS",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">System-wide overview for administrators</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Mentors</div>
          <div className="text-3xl font-bold text-indigo-600">45</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Mentees</div>
          <div className="text-3xl font-bold text-green-600">320</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Pending Reports</div>
          <div className="text-3xl font-bold text-yellow-600">12</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Active Alerts</div>
          <div className="text-3xl font-bold text-red-600">8</div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600">Activity feed will be implemented in Week 4-5</p>
      </div>
    </div>
  );
}
