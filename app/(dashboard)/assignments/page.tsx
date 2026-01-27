import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentor Assignments - SMMS",
};

export default function AssignmentsPage() {
  const assignments = [
    {
      id: 1,
      mentor: "Dr. John Smith",
      student: "Alice Johnson",
      assignedDate: "2026-01-15",
      status: "Active",
      department: "Computer Science",
      progress: 75,
    },
    {
      id: 2,
      mentor: "Dr. Sarah Williams",
      student: "Bob Davis",
      assignedDate: "2026-01-10",
      status: "Active",
      department: "Computer Science",
      progress: 50,
    },
    {
      id: 3,
      mentor: "Dr. John Smith",
      student: "Carol Smith",
      assignedDate: "2025-12-20",
      status: "Completed",
      department: "Computer Science",
      progress: 100,
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mentor Assignments</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          New Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search assignments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Departments</option>
          <option>Computer Science</option>
          <option>Electronics</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mentor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Progress</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{assignment.mentor}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{assignment.student}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{assignment.assignedDate}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${assignment.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{assignment.progress}%</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
