import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Users - SMMS",
};

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "John Admin",
      email: "admin@university.edu",
      role: "Super Admin",
      department: "Administration",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Sarah Williams",
      email: "sarah@university.edu",
      role: "Department Admin",
      department: "Computer Science",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. John Smith",
      email: "john@university.edu",
      role: "Mentor",
      department: "Computer Science",
      status: "Active",
    },
    {
      id: 4,
      name: "Alice Johnson",
      email: "alice@university.edu",
      role: "Student",
      department: "Computer Science",
      status: "Active",
    },
    {
      id: 5,
      name: "Bob Davis",
      email: "bob@university.edu",
      role: "Student",
      department: "Electronics",
      status: "Active",
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-100 text-red-800";
      case "Department Admin":
        return "bg-orange-100 text-orange-800";
      case "Mentor":
        return "bg-blue-100 text-blue-800";
      case "Student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage all system users and their roles</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Roles</option>
          <option>Super Admin</option>
          <option>Department Admin</option>
          <option>Mentor</option>
          <option>Student</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Departments</option>
          <option>Computer Science</option>
          <option>Electronics</option>
          <option>Mechanical</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.department}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Disable</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
