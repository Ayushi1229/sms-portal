import type { Metadata } from "next";
import { SearchIcon, FilterIcon, Clock, User, CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Session Activity Logs - SMMS",
};

export default function SessionActivityLogsPage() {
  const sessionLogs = [
    {
      id: 1,
      mentor: "Dr. Sarah Johnson",
      student: "John Doe",
      topic: "Database Design",
      scheduledTime: "2024-01-15 2:00 PM",
      startTime: "2024-01-15 2:02 PM",
      endTime: "2024-01-15 3:00 PM",
      status: "Completed",
      duration: 58,
      mode: "In-Person",
    },
    {
      id: 2,
      mentor: "Dr. Ahmed Hassan",
      student: "Jane Smith",
      topic: "Web Development",
      scheduledTime: "2024-01-15 3:30 PM",
      startTime: "2024-01-15 3:28 PM",
      endTime: "2024-01-15 4:30 PM",
      status: "Completed",
      duration: 62,
      mode: "Virtual",
    },
    {
      id: 3,
      mentor: "Prof. Michael Chen",
      student: "Mike Johnson",
      topic: "Data Structures",
      scheduledTime: "2024-01-14 1:00 PM",
      startTime: "2024-01-14 1:15 PM",
      endTime: "2024-01-14 2:00 PM",
      status: "Completed",
      duration: 45,
      mode: "In-Person",
    },
    {
      id: 4,
      mentor: "Dr. Sarah Johnson",
      student: "Emily Davis",
      topic: "Project Review",
      scheduledTime: "2024-01-10 4:00 PM",
      startTime: null,
      endTime: null,
      status: "Cancelled",
      duration: 0,
      mode: "Virtual",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Session Activity Logs</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sessions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Completed</option>
          <option>Cancelled</option>
          <option>Rescheduled</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Modes</option>
          <option>In-Person</option>
          <option>Virtual</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mentor → Student</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Topic</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mode</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Start Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessionLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 text-xs">{log.mentor}</p>
                        <p className="text-gray-600 text-xs">↓</p>
                        <p className="text-gray-600 text-xs">{log.student}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{log.topic}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.mode === "Virtual"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {log.mode}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {log.startTime ? (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={14} />
                        {log.startTime}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{log.duration > 0 ? `${log.duration} min` : "—"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                      log.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {log.status === "Completed" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">Showing 1-4 of 48 sessions</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">← Previous</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next →</button>
        </div>
      </div>
    </div>
  );
}
