import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Sessions - SMMS",
};

export default function SessionsPage() {
  const sessions = [
    {
      id: 1,
      mentor: "Dr. John Smith",
      student: "Alice Johnson",
      date: "2026-01-28",
      time: "2:00 PM - 3:00 PM",
      location: "Room 101",
      mode: "In-Person",
      status: "Scheduled",
      topic: "Project Discussion",
    },
    {
      id: 2,
      mentor: "Dr. Sarah Williams",
      student: "Bob Davis",
      date: "2026-01-29",
      time: "3:30 PM - 4:30 PM",
      location: "Virtual",
      mode: "Virtual",
      status: "Scheduled",
      topic: "Career Guidance",
    },
    {
      id: 3,
      mentor: "Dr. John Smith",
      student: "Carol Smith",
      date: "2026-01-26",
      time: "1:00 PM - 2:00 PM",
      location: "Room 205",
      mode: "In-Person",
      status: "Completed",
      topic: "Academic Progress Review",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          Schedule Session
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sessions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Statuses</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Modes</option>
          <option>In-Person</option>
          <option>Virtual</option>
          <option>Hybrid</option>
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
            {sessions.map((session) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
