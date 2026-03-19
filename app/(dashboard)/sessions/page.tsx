'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  Clock,
  MapPin,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  User,
  ExternalLink,
  XCircle
} from "lucide-react";
import Link from "next/link";

interface Session {
  id: string;
  mentor: string;
  student: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  status: string;
  topic: string;
}

interface ApiPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function SessionsPage() {
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchSessions();
  }, [debouncedSearch, status, dateFrom, page]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        paginated: 'true',
        page: String(page),
        pageSize: '100',
      });

      if (debouncedSearch) params.set('search', debouncedSearch);
      if (status) params.set('status', status);
      if (dateFrom) params.set('dateFrom', dateFrom);

      const response = await fetch(`/api/sessions?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await response.json();
      setSessions(data.items || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SCHEDULED": return "bg-blue-50 text-blue-600 border-blue-100";
      case "COMPLETED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "CANCELLED": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mentoring Sessions</h1>
          <p className="text-gray-500 mt-1">Manage and track all scheduled meetings</p>
        </div>
        <Link href="/sessions/schedule">
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm hover:shadow-md font-bold">
            <Plus size={20} />
            Schedule Session
          </button>
        </Link>
      </div>

      {/* Modern Filter Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by topic, student or mentor..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>
        <div className="lg:col-span-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="lg:col-span-3">
          <div className="relative">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>
        </div>
        <button className="lg:col-span-1 flex items-center justify-center p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
          <Filter size={18} />
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-4 flex items-center gap-3">
          <XCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Advanced Sessions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Topic & Participants</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Timing</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Mode</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-4"><div className="h-12 bg-gray-50 rounded-xl"></div></td>
                  </tr>
                ))
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <CalendarIcon size={48} />
                      <p className="font-bold">No sessions found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{session.topic}</span>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 font-medium">
                          <User size={12} />
                          <span>{session.mentor} • {session.student}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700">{session.date}</span>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-400 font-bold uppercase tracking-wider">
                          <Clock size={12} />
                          {session.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${session.mode === 'ONLINE' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                          {session.mode === 'ONLINE' ? <Video size={14} /> : <MapPin size={14} />}
                        </div>
                        <span className="text-xs font-bold text-gray-600">{session.location || session.mode}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link href={`/sessions/${session.id}`}>
                        <button className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">
                          Details
                          <ExternalLink size={14} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
