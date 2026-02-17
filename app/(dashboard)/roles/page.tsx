'use client';

import { useEffect, useState } from "react";
import { SearchIcon, FilterIcon, PlusIcon, ShieldIcon, Users } from "lucide-react";

interface Role {
  id: number;
  name: string;
  description: string;
  _count?: {
    users: number;
  };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles');
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('admin')) return "bg-red-100 text-red-800";
    if (n.includes('mentor')) return "bg-blue-100 text-blue-800";
    if (n.includes('student')) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const permissionCategories = [
    { category: "Users", items: 12 },
    { category: "Students", items: 10 },
    { category: "Mentors", items: 8 },
    { category: "Sessions", items: 7 },
    { category: "Reports", items: 5 },
    { category: "System", items: 3 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading roles...</span>
      </div>
    );
  }

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          <option>System Roles</option>
          <option>Custom Roles</option>
        </select>
        <button 
          onClick={fetchRoles}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          <FilterIcon size={20} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                No roles found matching your criteria.
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div key={role.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldIcon size={24} className="text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(role.name)}`}>
                          Active Role
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{role.description || "Default system role with predefined permissions."}</p>
                    </div>
                    <button className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                  </div>
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-gray-400" />
                      <span className="text-sm text-gray-600">System assigned role</span>
                    </div>
                  </div>
                </div>
              ))
            )}
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
