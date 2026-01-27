import type { Metadata } from "next";
import { SearchIcon, FilterIcon, PlusIcon, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Goals - SMMS",
};

export default function GoalsPage() {
  const goals = [
    {
      id: 1,
      student: "Alice Johnson",
      mentor: "Dr. John Smith",
      title: "Master Data Structures",
      category: "Academic",
      progress: 80,
      status: "In Progress",
      targetDate: "2026-03-31",
    },
    {
      id: 2,
      student: "Bob Davis",
      mentor: "Dr. Sarah Williams",
      title: "Complete Web Development Project",
      category: "Career",
      progress: 60,
      status: "In Progress",
      targetDate: "2026-02-28",
    },
    {
      id: 3,
      student: "Carol Smith",
      mentor: "Dr. John Smith",
      title: "Improve Communication Skills",
      category: "Personal",
      progress: 100,
      status: "Completed",
      targetDate: "2026-01-25",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academic":
        return "bg-blue-100 text-blue-800";
      case "Career":
        return "bg-purple-100 text-purple-800";
      case "Personal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          New Goal
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search goals..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          <option>Academic</option>
          <option>Career</option>
          <option>Personal</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Abandoned</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {goal.status === "Completed" && <CheckCircle size={20} className="text-green-600" />}
                  <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{goal.student}</span> with <span className="font-semibold">{goal.mentor}</span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(goal.category)}`}>
                {goal.category}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-gray-900">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Target: {goal.targetDate}</span>
              <button className="text-blue-600 hover:underline font-semibold">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
