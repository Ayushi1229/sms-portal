'use client';

import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Eye,
  XCircle,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";

interface Feedback {
  id: string;
  mentor: string;
  student: string;
  date: string;
  rating: number;
  status: string;
  category: string;
}

interface ApiPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchFeedback();
  }, [debouncedSearch, feedbackType, page]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        paginated: 'true',
        page: String(page),
        pageSize: '100',
      });

      if (debouncedSearch) params.set('search', debouncedSearch);
      if (feedbackType) params.set('type', feedbackType);

      const response = await fetch(`/api/feedback?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await response.json();
      setFeedbacks(data.items || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFeedback();
      } else {
        alert('Failed to delete feedback');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Feedback & Reviews</h1>
          <p className="text-gray-500 mt-1">Monitor quality and growth across sessions</p>
        </div>
        <Link href="/feedback/new">
          <button className="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-xl hover:bg-rose-700 transition shadow-sm hover:shadow-md font-bold text-sm">
            <Plus size={18} />
            New Feedback
          </button>
        </Link>
      </div>

      {/* Modern Filter Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="lg:col-span-7 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search feedback comments, mentors or students..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 transition-all text-sm"
          />
        </div>
        <div className="lg:col-span-4">
          <select
            value={feedbackType}
            onChange={(e) => {
              setFeedbackType(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 transition-all text-sm"
          >
            <option value="">All Categories</option>
            <option value="MENTOR_TO_STUDENT">Mentor Feedback</option>
            <option value="STUDENT_TO_MENTOR">Student Feedback</option>
          </select>
        </div>
        <button 
          onClick={fetchFeedback}
          className="lg:col-span-1 flex items-center justify-center p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-4 flex items-center gap-3">
          <XCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Premium Feedback List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Parties Involved</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Rating</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                  </tr>
                ))
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                       <MessageSquare size={48} />
                       <p className="font-bold">No feedback entries found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="group hover:bg-rose-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">{feedback.mentor}</span>
                        <span className="text-xs font-bold text-gray-400">Recipient: {feedback.student}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${feedback.category === 'Mentor Feedback' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                        {feedback.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} className={s <= feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-500 whitespace-nowrap">
                      {feedback.date}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <Link href={`/feedback/${feedback.id}`}>
                           <button className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm">
                             <Eye size={18} />
                           </button>
                        </Link>
                        <Link href={`/feedback/edit/${feedback.id}`}>
                          <button className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm">
                            <Edit size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => deleteFeedback(feedback.id)}
                          className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-rose-100 hover:text-rose-700 transition-colors shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
