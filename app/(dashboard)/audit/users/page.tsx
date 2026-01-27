import type { Metadata } from "next";
import { SearchIcon, FilterIcon, User, Clock, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "User Activity Logs - SMMS",
};

export default function UserActivityLogsPage() {
  const activityLogs = [
    {
      id: 1,
      user: "Dr. Sarah Johnson",
      email: "sarah.johnson@edu",
      activity: "Created new session",
      timestamp: "2024-01-15 10:30:45",
      duration: "2 min",
      status: "Success",
    },
    {
      id: 2,
      user: "John Doe",
      email: "john.doe@student.edu",
      activity: "Submitted feedback",
      timestamp: "2024-01-15 10:15:30",
      duration: "5 min",
      status: "Success",
    },
    {
      id: 3,
      user: "Admin User",
      email: "admin@smms.edu",
      activity: "Updated user permissions",
      timestamp: "2024-01-15 09:45:22",
      duration: "1 min",
      status: "Success",
    },
    {
      id: 4,
      user: "Jane Smith",
      email: "jane.smith@student.edu",
      activity: "Viewed session recording",
      timestamp: "2024-01-15 09:30:15",
      duration: "12 min",
      status: "Success",
    },
    {
      id: 5,
      user: "Prof. Michael Chen",
      email: "michael.chen@edu",
      activity: "Exported student report",
      timestamp: "2024-01-14 23:55:30",
      duration: "3 min",
      status: "Success",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Activity Logs</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search user activity..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Activities</option>
          <option>Create</option>
          <option>Update</option>
          <option>View</option>
          <option>Delete</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {activityLogs.map((log, idx) => (
            <div key={log.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {log.user.split(" ")[0][0]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{log.user}</h4>
                    <p className="text-sm text-gray-600">{log.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {log.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Activity size={16} />
                    {log.activity}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {log.timestamp}
                  </div>
                  <span className="text-xs">Duration: {log.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">Showing 1-5 of 234 activities</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">← Previous</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next →</button>
        </div>
      </div>
    </div>
  );
}
