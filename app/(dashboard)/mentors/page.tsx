import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentors - SMMS",
};

export default function MentorsPage() {
  const mentors = [
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@university.edu",
      department: "Computer Science",
      specialization: "Database Systems",
      capacity: "5/10 Students",
      status: "Available",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Dr. Sarah Williams",
      email: "sarah.williams@university.edu",
      department: "Computer Science",
      specialization: "Web Development",
      capacity: "8/10 Students",
      status: "Limited",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Prof. Michael Brown",
      email: "michael.brown@university.edu",
      department: "Electronics",
      specialization: "Embedded Systems",
      capacity: "10/10 Students",
      status: "Full",
      rating: 4.9,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Limited":
        return "bg-yellow-100 text-yellow-800";
      case "Full":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mentors</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          Add Mentor
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search mentors..."
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
          <option>All Status</option>
          <option>Available</option>
          <option>Limited</option>
          <option>Full</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Ratings</option>
          <option>4.5+</option>
          <option>4.0+</option>
          <option>3.5+</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-sm text-gray-600">{mentor.department}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-900">{mentor.rating}</span>
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
              <button className="text-blue-600 hover:underline text-sm font-semibold">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

