import type { Metadata } from "next";
import { SearchIcon, FilterIcon, Eye, Download, Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Audit Logs - SMMS",
};

export default function AuditLogsPage() {
  const auditLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 10:30:45",
      user: "admin@smms.edu",
      action: "Create User",
      resource: "User: john.doe@edu",
      status: "Success",
      severity: "medium",
    },
    {
      id: 2,
      timestamp: "2024-01-15 10:25:12",
      user: "mentor@smms.edu",
      action: "Update Session",
      resource: "Session: Database Design",
      status: "Success",
      severity: "low",
    },
    {
      id: 3,
      timestamp: "2024-01-15 10:15:30",
      user: "student@smms.edu",
      action: "View Report",
      resource: "Report: Student Progress",
      status: "Success",
      severity: "low",
    },
    {
      id: 4,
      timestamp: "2024-01-15 09:45:22",
      user: "admin@smms.edu",
      action: "Delete User",
      resource: "User: inactive.user@edu",
      status: "Success",
      severity: "high",
    },
    {
      id: 5,
      timestamp: "2024-01-15 09:30:15",
      user: "deptadmin@smms.edu",
      action: "Modify Permissions",
      resource: "Role: Mentor",
      status: "Success",
      severity: "medium",
    },
    {
      id: 6,
      timestamp: "2024-01-15 08:20:45",
      user: "system",
      action: "Backup Database",
      resource: "Database: smms_db",
      status: "Success",
      severity: "high",
    },
    {
      id: 7,
      timestamp: "2024-01-14 23:55:30",
      user: "unknown",
      action: "Failed Login Attempt",
      resource: "User: admin@smms.edu",
      status: "Failed",
      severity: "high",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Success"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Download size={20} />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Actions</option>
          <option>Create</option>
          <option>Update</option>
          <option>Delete</option>
          <option>View</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Severity</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Resource</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} />
                      {log.user}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{log.action}</td>
                  <td className="py-3 px-4 text-gray-600">{log.resource}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getSeverityColor(log.severity)}`}>
                      {log.severity}
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
        <p className="text-sm text-gray-600">Showing 1-7 of 127 logs</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">← Previous</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next →</button>
        </div>
      </div>
    </div>
  );
}
