import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Feedback - SMMS",
};

export default function FeedbackPage() {
  const feedbacks = [
    {
      id: 1,
      mentor: "Dr. John Smith",
      student: "Alice Johnson",
      date: "2026-01-25",
      rating: 4.5,
      status: "Completed",
      category: "Session Quality",
    },
    {
      id: 2,
      mentor: "Dr. Sarah Williams",
      student: "Bob Davis",
      date: "2026-01-24",
      rating: 5,
      status: "Completed",
      category: "Progress",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Feedback & Reviews</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          New Feedback
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search feedback..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          <option>Session Quality</option>
          <option>Progress</option>
          <option>Behavior</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Mentors</option>
          <option>Dr. John Smith</option>
          <option>Dr. Sarah Williams</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mentor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900">{feedback.mentor}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{feedback.student}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{feedback.category}</td>
                <td className="px-6 py-4 text-sm font-semibold text-yellow-500">
                  {"⭐".repeat(Math.floor(feedback.rating))} {feedback.rating}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{feedback.date}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {feedback.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
