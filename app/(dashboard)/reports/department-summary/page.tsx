'use client';

import { useEffect, useState } from "react";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  History, 
  Target,
  ChevronRight,
  TrendingUp,
  RefreshCcw,
  Activity,
  CalendarDays
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

interface DeptStats {
  mentors: number;
  students: number;
  alerts: number;
  activeGoals: number;
  sessions: number;
  departmentName: string;
}

export default function DepartmentSummaryPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DeptStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const overviewCards = [
    { label: "Faculty Mentors", value: stats?.mentors || 0, icon: Users, color: "bg-blue-600", href: "/mentors" },
    { label: "Enrolled Students", value: stats?.students || 0, icon: GraduationCap, color: "bg-indigo-600", href: "/students" },
    { label: "Recorded Sessions", value: stats?.sessions || 0, icon: History, color: "bg-emerald-600", href: "/sessions" },
    { label: "Active Goals", value: stats?.activeGoals || 0, icon: Target, color: "bg-purple-600", href: "/goals" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Building2 className="text-indigo-600 w-8 h-8" />
            Departmental Analytics
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Performance overview for <span className="text-indigo-600 font-bold">{stats?.departmentName || 'Your Department'}</span>
          </p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2 font-bold text-xs"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Stats
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link href={card.href} key={idx} className="group">
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden">
                <div className={`p-3 rounded-xl ${card.color} text-white w-fit mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-1">{loading ? "..." : card.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
                <div className="absolute top-8 right-8 text-gray-100 group-hover:text-indigo-50 transition-colors">
                  <ChevronRight size={32} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Performance Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Health */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <TrendingUp className="text-emerald-500" />
              Engagement Health
            </h3>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">ACTIVE</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-500">Overall Mentorship Coverage</span>
                <span className="text-emerald-600">88%</span>
              </div>
              <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[88%]"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-500">Goal Completion Rate</span>
                <span className="text-blue-600">62%</span>
              </div>
              <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[62%]"></div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 font-medium leading-relaxed pt-4">
              Our department is currently maintaining a high level of mentor-to-student engagement. Goal completion is tracking 5% higher than previous quarter.
            </p>
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <Activity className="text-indigo-400" />
              Department Load
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <CalendarDays size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">{stats?.sessions || 0} Sessions</h4>
                  <p className="text-gray-400 text-xs font-medium">Recorded in this cycle</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Users size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">{stats?.mentors || 0} Faculty Members</h4>
                  <p className="text-gray-400 text-xs font-medium">Actively mentoring</p>
                </div>
              </div>
              
              <Link href="/dashboard" className="block pt-6">
                <button className="w-full bg-indigo-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all">
                  Access Management Dash
                </button>
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
