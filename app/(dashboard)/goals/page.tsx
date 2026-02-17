'use client';

import { useEffect, useState } from "react";
import { SearchIcon, FilterIcon, PlusIcon, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Goal {
  id: string;
  student: string;
  mentor: string;
  title: string;
  category: string;
  progress: number;
  status: string;
  targetDate: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/goals');
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toUpperCase()) {
      case "ACADEMIC":
        return "bg-blue-100 text-blue-800";
      case "CAREER":
        return "bg-purple-100 text-purple-800";
      case "BEHAVIORAL":
        return "bg-yellow-100 text-yellow-800";
      case "WELLNESS":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        goal.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        goal.mentor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || goal.status.toUpperCase() === selectedStatus.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading goals...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
        <Link href="/goals/new">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <PlusIcon size={20} />
            New Goal
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative col-span-2">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="AT_RISK">At Risk</option>
        </select>
        <button 
          onClick={fetchGoals}
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

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
            No goals found.
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {goal.status === "COMPLETED" && <CheckCircle size={20} className="text-green-600" />}
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
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Target: {goal.targetDate}</span>
                <div className="flex gap-4">
                  <span className={`font-semibold ${goal.status === "AT_RISK" ? "text-red-600" : "text-gray-600"}`}>{goal.status}</span>
                  <button className="text-blue-600 hover:underline font-semibold">View Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
