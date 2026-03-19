'use client';

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Download, 
  PlusIcon,
  Calendar,
  AlertCircle,
  Clock,
  ChevronRight,
  Search,
  CheckCircle2,
  RefreshCcw,
  Activity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Role } from "@/lib/auth/permissions";

interface ReportStat {
  mentors: number;
  students: number;
  alerts: number;
  activeGoals: number;
  sessions: number;
  departmentName: string;
}

interface RecentActivity {
  id: string;
  student: string;
  topic: string;
  date: string;
  status: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReportStat | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/sessions?pageSize=5&paginated=true')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (activityRes.ok) {
        const data = await activityRes.json();
        setActivities(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isMentor = user?.roleId === Role.MENTOR;

  const categories = [
    {
      name: isMentor ? "My Goal Reports" : "Student Progress",
      icon: TrendingUp,
      description: "Monitor achievement of academic and behavioral goals",
      value: stats?.activeGoals || 0,
      label: "Active Goals",
      color: "from-blue-500 to-cyan-400",
      href: "/goals"
    },
    {
      name: "Attendance Logs",
      icon: Clock,
      description: "Complete history of mentoring sessions and participation",
      value: stats?.sessions || 0,
      label: "Total Sessions",
      color: "from-emerald-500 to-teal-400",
      href: "/sessions"
    },
    {
      name: "Risk Assessment",
      icon: AlertCircle,
      description: "Critical alerts and immediate intervention tracking",
      value: stats?.alerts || 0,
      label: "Open Alerts",
      color: "from-rose-500 to-orange-400",
      href: "/reports/risk-analysis"
    },
    {
      name: isMentor ? "Activity Summary" : "Department Analytics",
      icon: BarChart3,
      description: "High-level overview of department-wide performance",
      value: isMentor ? activities.length : stats?.students || 0,
      label: isMentor ? "Recent Actions" : "Total Students",
      color: "from-indigo-500 to-purple-400",
      href: isMentor ? "/sessions" : "/reports/department-summary"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-blue-600 w-10 h-10" />
            System Reports
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Real-time analytics for <span className="text-blue-600 font-bold">{stats?.departmentName || 'Your Department'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:shadow-lg transition-all"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/sessions">
            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl hover:bg-black transition shadow-xl shadow-gray-200 font-bold tracking-tight">
              <Activity size={20} />
              View Live Activity
            </button>
          </Link>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Link href={cat.href} key={idx} className="group">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden h-full">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-5 rounded-bl-full`}></div>
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={28} />
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">{cat.description}</p>
                
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-3xl font-black text-gray-900">{loading ? '...' : cat.value}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat.label}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Log - REAL DATA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Activity className="text-blue-600" />
              Live Activity Stream
            </h3>
            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">Live Updates</span>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="group p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-blue-50/30 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-blue-600">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">
                          {activity.student}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium line-clamp-1">{activity.topic}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1"><Clock size={12} /> {activity.date}</span>
                          <span className={`flex items-center gap-1 ${activity.status === 'COMPLETED' ? 'text-emerald-500' : 'text-blue-500'}`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/sessions?search=${activity.student}`}>
                        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                          View Details
                          <ArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400 font-medium">
                  No recent activity records found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Highlights / Guides */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" />
            System Status
          </h3>
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100 h-full min-h-[300px] flex flex-col">
            <div className="relative z-10 space-y-6 flex-1">
              <div className="space-y-2">
                <p className="text-emerald-100 text-xs font-black uppercase tracking-widest font-mono">Operations</p>
                <h4 className="text-2xl font-bold leading-tight">All Reporting Engines Functional</h4>
                <p className="text-emerald-100/60 text-sm font-medium">System is monitoring all {stats?.sessions || 0} session records and {stats?.activeGoals || 0} active goals.</p>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between border border-white/10 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold">Real-time Data Active</span>
                </div>
              </div>

              <Link href="/dashboard" className="block w-full">
                <button className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-50 transition-all shadow-lg">
                  Return to Control Centre
                </button>
              </Link>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
