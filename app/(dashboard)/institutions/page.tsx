import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon, MapPin, Building } from "lucide-react";

export const metadata: Metadata = {
  title: "Institutions - SMMS",
};

export default function InstitutionsPage() {
  const institutions = [
    {
      id: 1,
      code: "MIT",
      name: "Massachusetts Institute of Technology",
      address: "Cambridge, Massachusetts, USA",
      email: "admin@mit.edu",
      departments: 8,
      mentors: 45,
      students: 250,
      status: "Active",
    },
    {
      id: 2,
      code: "SIU",
      name: "Sample Institute University",
      address: "New York, New York, USA",
      email: "admin@sampleinstitute.edu",
      departments: 6,
      mentors: 32,
      students: 180,
      status: "Active",
    },
    {
      id: 3,
      code: "XYZ",
      name: "XYZ Engineering College",
      address: "Delhi, India",
      email: "admin@xyzengineering.edu",
      departments: 4,
      mentors: 24,
      students: 120,
      status: "Active",
    },
  ];

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

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((institution) => (
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
        ))}
      </div>
    </div>
  );
}

