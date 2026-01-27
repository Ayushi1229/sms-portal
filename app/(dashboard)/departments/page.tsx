import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Departments - SMMS",
};

export default function DepartmentsPage() {
  const departments = [
    {
      id: 1,
      code: "CSE",
      name: "Computer Science & Engineering",
      mentors: 8,
      students: 45,
      status: "Active",
    },
    {
      id: 2,
      code: "ECE",
      name: "Electronics & Communication",
      mentors: 6,
      students: 38,
      status: "Active",
    },
    {
      id: 3,
      code: "ME",
      name: "Mechanical Engineering",
      mentors: 5,
      students: 32,
      status: "Active",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          Add Department
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search departments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                <p className="text-sm text-gray-600 font-mono">{dept.code}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                {dept.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={18} className="text-blue-600" />
                <span className="text-sm"><span className="font-semibold">{dept.mentors}</span> Mentors</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={18} className="text-green-600" />
                <span className="text-sm"><span className="font-semibold">{dept.students}</span> Students</span>
              </div>
            </div>

            <button className="w-full text-blue-600 hover:underline text-sm font-semibold">View Details →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

