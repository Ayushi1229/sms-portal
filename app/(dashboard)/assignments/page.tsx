'use client';

import { useEffect, useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import Link from "next/link";

interface Assignment {
  id: string;
  mentor: string;
  student: string;
  assignedDate: string;
  status: string;
  department: string;
  progress: number;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assignments');
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status.toUpperCase() === "ACTIVE" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  };

  const filteredAssignments = assignments.filter(assignment => 
    assignment.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading assignments...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mentor Assignments</h1>
        <Link href="/assignments/new">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus size={20} />
            New Assignment
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
        <button 
          onClick={fetchAssignments}
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
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No assignments found.
                </td>
              </tr>
            ) : (
              filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{assignment.mentor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{assignment.student}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{assignment.assignedDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${assignment.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{assignment.progress}% Complete</span>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
