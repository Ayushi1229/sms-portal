import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Students - SMMS",
};

export default function StudentsPage() {
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      enrollmentNumber: "CS2023001",
      email: "alice@university.edu",
      department: "Computer Science",
      mentor: "Dr. John Smith",
      status: "Active",
      riskLevel: "Low",
      cgpa: 3.8,
    },
    {
      id: 2,
      name: "Bob Davis",
      enrollmentNumber: "CS2023002",
      email: "bob@university.edu",
      department: "Computer Science",
      mentor: "Dr. Sarah Williams",
      status: "Active",
      riskLevel: "Medium",
      cgpa: 3.2,
    },
    {
      id: 3,
      name: "Carol Smith",
      enrollmentNumber: "CS2023003",
      email: "carol@university.edu",
      department: "Computer Science",
      mentor: "Dr. John Smith",
      status: "Active",
      riskLevel: "High",
      cgpa: 2.5,
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Departments</option>
          <option>Computer Science</option>
          <option>Electronics</option>
          <option>Mechanical</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Mentors</option>
          <option>Dr. John Smith</option>
          <option>Dr. Sarah Williams</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Risk Levels</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Enrollment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mentor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">CGPA</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Risk Level</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.enrollmentNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.mentor}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.cgpa}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(student.riskLevel)}`}>
                    {student.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:underline">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
