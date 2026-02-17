'use client';

import { useEffect, useState } from "react";

interface Stats {
  mentors: number;
  students: number;
  alerts: number;
  activeGoals: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">System-wide overview for administrators</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Mentors</div>
          <div className="text-3xl font-bold text-indigo-600">{loading ? '...' : stats?.mentors}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Students</div>
          <div className="text-3xl font-bold text-green-600">{loading ? '...' : stats?.students}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Active Goals</div>
          <div className="text-3xl font-bold text-yellow-600">{loading ? '...' : stats?.activeGoals}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Active Alerts</div>
          <div className="text-3xl font-bold text-red-600">{loading ? '...' : stats?.alerts}</div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-sm">No recent activity detected.</div>
      </div>
    </div>
  );
}
