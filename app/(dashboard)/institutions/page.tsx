'use client';

import { useEffect, useState } from "react";
import { SearchIcon, FilterIcon, PlusIcon, MapPin, Building } from "lucide-react";

interface Institution {
  id: string;
  code: string;
  name: string;
  address: string;
  email: string;
  departments: number;
  mentors: number;
  students: number;
  status: string;
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institutions');
      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }
      const data = await response.json();
      setInstitutions(data);
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading institutions...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Institutions</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          Add Institution
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search institutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutions.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No institutions found.
          </div>
        ) : (
          filteredInstitutions.map((institution) => (
            <div key={institution.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{institution.name}</h3>
                  <p className="text-sm text-gray-600 font-mono">{institution.code}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  {institution.status}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{institution.address}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <Building size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{institution.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{institution.departments}</p>
                  <p className="text-xs text-gray-600">Departments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{institution.mentors}</p>
                  <p className="text-xs text-gray-600">Mentors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{institution.students}</p>
                  <p className="text-xs text-gray-600">Students</p>
                </div>
              </div>

              <button className="w-full text-blue-600 hover:underline text-sm font-semibold pt-4">Manage →</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

