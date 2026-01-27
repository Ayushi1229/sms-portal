import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon, ShieldIcon, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Roles & Permissions - SMMS",
};

export default function RolesPage() {
  const roles = [
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access and control",
      permissions: 45,
      users: 2,
      color: "bg-red-100 text-red-800",
    },
    {
      id: 2,
      name: "Department Admin",
      description: "Department-level management and reporting",
      permissions: 28,
      users: 5,
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: 3,
      name: "Mentor",
      description: "Manage assigned students and sessions",
      permissions: 18,
      users: 45,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 4,
      name: "Student",
      description: "Access personal sessions and feedback",
      permissions: 8,
      users: 250,
      color: "bg-green-100 text-green-800",
    },
  ];

  const permissionCategories = [
    { category: "Users", items: 12 },
    { category: "Students", items: 10 },
    { category: "Mentors", items: 8 },
    { category: "Sessions", items: 7 },
    { category: "Reports", items: 5 },
    { category: "System", items: 3 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          New Role
        </button>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search roles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          <option>System Roles</option>
          <option>Custom Roles</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldIcon size={24} className="text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}>
                        {role.permissions} Permissions
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{role.description}</p>
                  </div>
                  <button className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{role.users} users assigned</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Categories</h3>
          <div className="space-y-3">
            {permissionCategories.map((cat) => (
              <div key={cat.category} className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">{cat.category}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                  {cat.items}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-blue-600 hover:underline text-sm font-semibold">View All Permissions →</button>
        </div>
      </div>
    </div>
  );
}
