import type { Metadata } from "next";
import { SearchIcon, FilterIcon, Star, MessageSquare, TrendingDown, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Student Feedback - SMMS",
};

export default function StudentFeedbackPage() {
  const studentFeedback = [
    {
      id: 1,
      name: "John Doe",
      mentor: "Dr. Sarah Johnson",
      semester: "Fall 2023",
      overallRating: 4.5,
      feedbackCount: 5,
      progress: "Excellent",
      strengths: ["Problem Solving", "Communication", "Time Management"],
      improvements: ["Database Optimization"],
      status: "On Track",
    },
    {
      id: 2,
      name: "Jane Smith",
      mentor: "Dr. Ahmed Hassan",
      semester: "Fall 2023",
      overallRating: 4.2,
      feedbackCount: 4,
      progress: "Good",
      strengths: ["Web Development", "Teamwork"],
      improvements: ["System Design", "Documentation"],
      status: "On Track",
    },
    {
      id: 3,
      name: "Mike Johnson",
      mentor: "Prof. Michael Chen",
      semester: "Fall 2023",
      overallRating: 3.8,
      feedbackCount: 3,
      progress: "Satisfactory",
      strengths: ["Data Structures"],
      improvements: ["Algorithms", "Code Quality"],
      status: "Needs Support",
    },
    {
      id: 4,
      name: "Emily Davis",
      mentor: "Dr. Sarah Johnson",
      semester: "Fall 2023",
      overallRating: 4.8,
      feedbackCount: 6,
      progress: "Outstanding",
      strengths: ["Leadership", "Innovation", "Technical Skills"],
      improvements: [],
      status: "Exceeding",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Exceeding":
        return "bg-green-100 text-green-800";
      case "On Track":
        return "bg-blue-100 text-blue-800";
      case "Needs Support":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Feedback & Progress</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Exceeding</option>
          <option>On Track</option>
          <option>Needs Support</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Semesters</option>
          <option>Fall 2023</option>
          <option>Spring 2023</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Student Cards */}
      <div className="space-y-4">
        {studentFeedback.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Student Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{feedback.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Mentor: {feedback.mentor}</p>
                <p className="text-sm text-gray-600">{feedback.semester}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(feedback.status)}`}>
                  {feedback.status}
                </span>
              </div>

              {/* Rating */}
              <div className="flex flex-col justify-center">
                <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Overall Rating</p>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(feedback.overallRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold text-gray-900">{feedback.overallRating}</p>
                <p className="text-xs text-gray-600">{feedback.feedbackCount} reviews</p>
              </div>

              {/* Strengths */}
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {feedback.strengths.map((strength, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Award size={12} />
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Areas for Improvement</p>
                  {feedback.improvements.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {feedback.improvements.map((improvement, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-semibold"
                        >
                          {improvement}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-green-600 font-semibold">No areas flagged</p>
                  )}
                </div>
                <button className="text-blue-600 hover:underline text-sm font-semibold mt-4">
                  View Detailed Feedback →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
