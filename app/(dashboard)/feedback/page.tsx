'use client';

import { useEffect, useState } from "react";
import { Search, Filter, Plus, Trash2, Edit } from "lucide-react";
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

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await response.json();
      setFeedbacks(data);
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
        setFeedbacks(feedbacks.filter(f => f.id !== id));
      } else {
        alert('Failed to delete feedback');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => 
    f.mentor.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading feedback...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Feedback & Reviews</h1>
        <Link href="/feedback/new">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus size={20} />
            New Feedback
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          <option>Session Quality</option>
          <option>Progress</option>
          <option>Behavior</option>
        </select>
        <button 
          onClick={fetchFeedback}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          <Filter size={20} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mentor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No feedback found.
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{feedback.mentor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{feedback.student}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{feedback.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-yellow-500">
                    {"⭐".repeat(Math.floor(feedback.rating))} {feedback.rating}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{feedback.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {feedback.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link href={`/feedback/edit/${feedback.id}`}>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => deleteFeedback(feedback.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
