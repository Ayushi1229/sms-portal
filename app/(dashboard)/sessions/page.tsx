'use client';

import { useEffect, useState } from "react";
import { SearchIcon, FilterIcon, PlusIcon, Clock, MapPin } from "lucide-react";
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

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading sessions...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
        <Link href="/sessions/schedule">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <PlusIcon size={20} />
            Schedule Session
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="relative col-span-2">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Statuses</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <input
          type="date"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mentor - Student</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Topic</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date & Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mode & Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No sessions found.
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => (
                <tr key={session.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{session.mentor}</div>
                    <div className="text-gray-600 text-xs">{session.student}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{session.topic}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{session.date}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock size={14} />
                      {session.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{session.mode}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin size={14} />
                      {session.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:underline">View Details</button>
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
