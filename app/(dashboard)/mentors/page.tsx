'use client';

import { useEffect, useState } from "react";
import { SearchIcon, FilterIcon, PlusIcon, Star } from "lucide-react";
import Link from "next/link";

interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  departmentId?: string;
  specialization: string;
  capacity: string;
  status: string;
  rating: number;
}

interface Department {
  id: string;
  name: string;
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    Promise.all([fetchMentors(), fetchDepartments()]);
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentors');
      if (!response.ok) {
        throw new Error('Failed to fetch mentors');
      }
      const data = await response.json();
      setMentors(data);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "LIMITED":
        return "bg-yellow-100 text-yellow-800";
      case "FULL":
      case "UNAVAILABLE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        mentor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        mentor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Some API responses might return departmentId if we structure it that way, 
    // but here we might need to match by name or ID depending on data structure
    const matchesDept = selectedDept === "all" || mentor.department === selectedDept || mentor.departmentId === selectedDept;
    const matchesStatus = selectedStatus === "all" || mentor.status.toUpperCase() === selectedStatus.toUpperCase();
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading mentors...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mentors</h1>
        <Link href="/users/new?role=mentor">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <PlusIcon size={20} />
            Add Mentor
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="relative col-span-2">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="LIMITED">Limited</option>
          <option value="FULL">Full</option>
        </select>
        <button 
          onClick={fetchMentors}
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

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No mentors found matching your criteria.
          </div>
        ) : (
          filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.department}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">{mentor.rating || 4.5}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Specialization:</span> {mentor.specialization}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {mentor.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Capacity:</span> {mentor.capacity}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mentor.status)}`}>
                  {mentor.status}
                </span>
                <Link href={`/users/${mentor.id}`}>
                  <button className="text-blue-600 hover:underline text-sm font-semibold">View Profile</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

