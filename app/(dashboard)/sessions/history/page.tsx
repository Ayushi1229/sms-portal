import type { Metadata } from "next";
import { SearchIcon, FilterIcon, CalendarIcon, Clock, User, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Session History - SMMS",
};

export default function SessionHistoryPage() {
  const sessionHistory = [
    {
      id: 1,
      mentor: "Dr. Sarah Johnson",
      student: "John Doe",
      topic: "Database Design Concepts",
      date: "2024-01-10",
      time: "2:00 PM - 3:00 PM",
      duration: 60,
      status: "Completed",
      notes: "Covered normalization and entity relationships",
      rating: 5,
    },
    {
      id: 2,
      mentor: "Dr. Ahmed Hassan",
      student: "Jane Smith",
      topic: "Web Development Best Practices",
      date: "2024-01-09",
      time: "3:30 PM - 4:30 PM",
      duration: 60,
      status: "Completed",
      notes: "Discussed React hooks and state management",
      rating: 4.5,
    },
    {
      id: 3,
      mentor: "Prof. Michael Chen",
      student: "Mike Johnson",
      topic: "Data Structures Review",
      date: "2024-01-08",
      time: "1:00 PM - 2:00 PM",
      duration: 60,
      status: "Completed",
      notes: "Reviewed sorting algorithms and complexity analysis",
      rating: 4,
    },
    {
      id: 4,
      mentor: "Dr. Sarah Johnson",
      student: "Emily Davis",
      topic: "Project Guidance",
      date: "2024-01-07",
      time: "4:00 PM - 5:00 PM",
      duration: 60,
      status: "Cancelled",
      notes: "Student requested reschedule",
      rating: 0,
    },
    {
      id: 5,
      mentor: "Dr. Ahmed Hassan",
      student: "John Doe",
      topic: "Career Development",
      date: "2024-01-05",
      time: "2:30 PM - 3:30 PM",
      duration: 60,
      status: "Completed",
      notes: "Discussed internship opportunities",
      rating: 5,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Session History</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by mentor or student..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Completed</option>
          <option>Cancelled</option>
          <option>Rescheduled</option>
        </select>
        <input
          type="date"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessionHistory.map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{session.topic}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    session.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{session.mentor}</span>
                  </div>
                  <span>→</span>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{session.student}</span>
                  </div>
                </div>
              </div>
              {session.status === "Completed" && session.rating > 0 && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-lg font-bold text-yellow-500">{session.rating} ★</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 py-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon size={16} className="text-blue-600" />
                <span>{session.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-blue-600" />
                <span>{session.time}</span>
              </div>
              <div className="text-sm text-gray-600">Duration: {session.duration} minutes</div>
            </div>

            {session.notes && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-1">Notes</p>
                <p className="text-sm text-gray-600">{session.notes}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button className="text-blue-600 hover:underline text-sm font-semibold">View Details</button>
              <button className="text-blue-600 hover:underline text-sm font-semibold">Download Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

