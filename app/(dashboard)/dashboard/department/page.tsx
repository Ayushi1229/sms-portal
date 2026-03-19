'use client';

import { useEffect, useState } from "react";
import { Landmark, Users, Calendar, TrendingUp, AlertCircle, Target } from "lucide-react";

interface Stats {
  mentors: number;
  students: number;
  alerts: number;
  activeGoals: number;
  sessions: number;
  departmentName: string;
}

export default function DepartmentDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-32 bg-white rounded-3xl border border-gray-100"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-32 bg-white rounded-3xl border border-gray-100"></div>
          <div className="h-32 bg-white rounded-3xl border border-gray-100"></div>
          <div className="h-32 bg-white rounded-3xl border border-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="p-5 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <Landmark className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {stats?.departmentName || 'Department Overview'}
            </h2>
            <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest opacity-60">
              Department-level metrics and quality oversight
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50 blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricBox 
          label="Active Mentors" 
          value={stats?.mentors.toString() || "0"} 
          icon={<Users className="w-6 h-6 text-indigo-600" />} 
          color="bg-indigo-50"
          trend="+2 This Month"
        />
        <MetricBox 
          label="Total Students" 
          value={stats?.students.toString() || "0"} 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          color="bg-blue-50"
          trend="Increasing Engagement"
        />
        <MetricBox 
          label="Mentoring Sessions" 
          value={stats?.sessions.toString() || "0"} 
          icon={<Calendar className="w-6 h-6 text-emerald-600" />} 
          color="bg-emerald-50"
          subtitle="All Time"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Alerts</p>
              <h3 className="text-2xl font-black text-gray-900">{stats?.alerts || 0}</h3>
            </div>
          </div>
          <div className="text-rose-600 font-black text-xs uppercase tracking-tighter bg-rose-50 px-3 py-1 rounded-full">Requires Action</div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">In-Progress Goals</p>
              <h3 className="text-2xl font-black text-gray-900">{stats?.activeGoals || 0}</h3>
            </div>
          </div>
          <div className="text-amber-600 font-black text-xs uppercase tracking-tighter bg-amber-50 px-3 py-1 rounded-full">Progressing</div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ 
  label, 
  value, 
  icon, 
  color, 
  trend, 
  subtitle 
}: { 
  label: string, 
  value: string, 
  icon: React.ReactNode, 
  color: string, 
  trend?: string, 
  subtitle?: string 
}) {
  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:border-indigo-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 ${color} rounded-2xl group-hover:rotate-6 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-tighter">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{label}</span>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-gray-900">{value}</span>
          {subtitle && <span className="text-xs font-bold text-gray-400 uppercase">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
