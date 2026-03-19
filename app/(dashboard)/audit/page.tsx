'use client';

import { useEffect, useState, useCallback } from "react";
import { 
  Search, 
  Clock, 
  User as UserIcon, 
  RefreshCcw,
  Shield,
  ChevronLeft,
  ChevronRight,
  Database,
  History,
  Info,
  ExternalLink
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: string;
  severity: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        paginated: 'true',
        search: search,
        action: actionFilter,
      });

      const res = await fetch(`/api/audit?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(total / pageSize);

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getImportanceBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-rose-50 text-rose-600 border-rose-100";
      case "medium": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Friendly Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
            <History size={16} />
            System Governance
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Activity Log
          </h1>
          <p className="text-gray-500 font-medium">
            Track who did what and when across the entire portal.
          </p>
        </div>
        
        {/* Discovery Summary */}
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Total Events</p>
            <p className="text-2xl font-black text-gray-900 text-center">{total}</p>
          </div>
          <button 
            onClick={() => fetchLogs()}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl hover:bg-black transition shadow-lg shadow-gray-200 font-bold"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh Feed
          </button>
        </div>
      </div>

      {/* Simplified Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by student name, user email, or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all font-medium"
          />
        </div>
        <div className="md:col-span-4">
          <select 
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all font-bold text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">All Activities</option>
            <option value="CREATE_ASSIGNMENT">New Assignments</option>
            <option value="LOGIN">User Logins</option>
            <option value="UPDATE_USER">Profile Edits</option>
          </select>
        </div>
      </div>

      {/* Cleaner Activity Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-50">
                <th className="text-xs font-bold text-gray-400 py-5 px-8 text-left uppercase tracking-wider">Time</th>
                <th className="text-xs font-bold text-gray-400 py-5 px-4 text-left uppercase tracking-wider">Performed By</th>
                <th className="text-xs font-bold text-gray-400 py-5 px-4 text-left uppercase tracking-wider">Action</th>
                <th className="text-xs font-bold text-gray-400 py-5 px-4 text-left uppercase tracking-wider">Related To</th>
                <th className="text-xs font-bold text-gray-400 py-5 px-8 text-right uppercase tracking-wider">Importance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-10 px-8"><div className="h-4 bg-gray-50 rounded-full w-3/4 mx-auto"></div></td>
                  </tr>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-6 px-8 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <Clock size={14} className="text-gray-300" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="font-bold text-gray-900 text-sm">{log.user}</div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                        {formatAction(log.action)}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                        <Info size={14} className="text-blue-300" />
                        {log.resource}
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getImportanceBadge(log.severity)}`}>
                        {log.severity || 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Search size={32} />
                      </div>
                      <p className="font-bold text-gray-900">No matching activities</p>
                      <p className="text-sm text-gray-500">Try adjusting your filters or search keywords.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User-Friendly Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <div className="text-sm text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">{((page - 1) * pageSize) + 1}</span> - <span className="font-bold text-gray-900">{Math.min(page * pageSize, total)}</span> of <span className="font-bold text-gray-900">{total}</span> activities
        </div>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${
                page === i + 1 
                 ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                 : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 5 && <span className="px-4 text-gray-300 font-black">...</span>}
        </div>
      </div>
    </div>
  );
}
