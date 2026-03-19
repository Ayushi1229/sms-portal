'use client';

import { useEffect, useState } from "react";
import { Activity, ShieldCheck, History } from "lucide-react";

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-500">Live updates from across the institution</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <Activity className="w-12 h-12 text-gray-300 mb-3" />
             <p className="text-gray-500 text-sm font-medium">No system activity detected recently.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">System Status</h2>
              <p className="text-sm text-gray-500">All services operational</p>
            </div>
          </div>
          <div className="space-y-4">
             <StatusRow label="Database" status="Active" color="emerald" />
             <StatusRow label="Auth Service" status="Active" color="emerald" />
             <StatusRow label="File Storage" status="Active" color="emerald" />
             <StatusRow label="Notifications" status="Active" color="emerald" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, status, color }: { label: string, status: string, color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
         <div className={`w-2 h-2 rounded-full ${colorMap[color]} animate-pulse`}></div>
         <span className="text-xs font-bold text-gray-500 uppercase">{status}</span>
      </div>
    </div>
  );
}
