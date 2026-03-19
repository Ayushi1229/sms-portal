'use client';

import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  TrendingUp, 
  Target as TargetIcon, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Calendar,
  XCircle
} from "lucide-react";
import Link from "next/link";

interface Goal {
  id: string;
  student: string;
  mentor: string;
  title: string;
  category: string;
  progress: number;
  status: string;
  targetDate: string;
}

interface ApiPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchGoals();
  }, [debouncedSearch, selectedStatus, page]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        paginated: 'true',
        page: String(page),
        pageSize: '100',
      });

      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedStatus) params.set('status', selectedStatus);

      const response = await fetch(`/api/goals?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data.items || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toUpperCase()) {
      case "ACADEMIC": return "bg-blue-50 text-blue-600 border-blue-100";
      case "CAREER": return "bg-purple-50 text-purple-600 border-purple-100";
      case "BEHAVIORAL": return "bg-amber-50 text-amber-600 border-amber-100";
      case "WELLNESS": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "AT_RISK": return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case "IN_PROGRESS": return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default: return <TargetIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mentoring Goals</h1>
          <p className="text-gray-500 mt-1">Track and measure academic progress</p>
        </div>
        <Link href="/goals/new">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm hover:shadow-md font-bold">
            <Plus size={20} />
            New Goal
          </button>
        </Link>
      </div>

      {/* Modern Filter Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="md:col-span-7 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search goals, students, or descriptions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          >
            <option value="">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="AT_RISK">At Risk</option>
            <option value="NOT_STARTED">Not Started</option>
          </select>
        </div>
        <button className="md:col-span-1 flex items-center justify-center p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
          <Filter size={18} />
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-4 flex items-center gap-3">
          <XCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-gray-100"></div>
          ))
        ) : goals.length === 0 ? (
          <div className="lg:col-span-2 py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
             <TargetIcon size={48} className="mx-auto text-gray-200 mb-4" />
             <p className="text-lg font-bold text-gray-400">No mentoring goals found.</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(goal.status)}
                    <h3 className="text-lg font-black text-gray-900 line-clamp-1">{goal.title}</h3>
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                    {goal.student} • {goal.mentor}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryColor(goal.category)}`}>
                  {goal.category}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-500 uppercase text-[10px] tracking-widest">Progress</span>
                  <span className="font-black text-blue-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden border border-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${goal.status === 'AT_RISK' ? 'bg-rose-500' : 'bg-blue-600'}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Calendar size={14} />
                  {goal.targetDate}
                </div>
                <Link href={`/goals/${goal.id}`}>
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
                    View Details
                    <ExternalLink size={14} />
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
