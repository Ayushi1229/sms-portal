import type { Metadata } from "next";
import { SearchIcon, FilterIcon, Star, User, Calendar, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentor Feedback - SMMS",
};

export default function MentorFeedbackPage() {
  const mentorFeedback = [
    {
      id: 1,
      mentor: "Dr. Sarah Johnson",
      ratingAverage: 4.7,
      totalFeedback: 24,
      categories: {
        communication: 4.8,
        knowledge: 4.9,
        helpfulness: 4.6,
        engagement: 4.5,
      },
      recentComments: [
        "Excellent mentor! Very patient and knowledgeable.",
        "Great session. She really understands the concepts well.",
      ],
      trend: "up",
    },
    {
      id: 2,
      mentor: "Dr. Ahmed Hassan",
      ratingAverage: 4.5,
      totalFeedback: 18,
      categories: {
        communication: 4.6,
        knowledge: 4.8,
        helpfulness: 4.4,
        engagement: 4.3,
      },
      recentComments: [
        "Very knowledgeable in web development.",
        "Good explanations, could use more examples.",
      ],
      trend: "up",
    },
    {
      id: 3,
      mentor: "Prof. Michael Chen",
      ratingAverage: 4.3,
      totalFeedback: 15,
      categories: {
        communication: 4.2,
        knowledge: 4.7,
        helpfulness: 4.3,
        engagement: 4.1,
      },
      recentComments: [
        "Strong technical knowledge.",
        "Would appreciate more interactive sessions.",
      ],
      trend: "stable",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mentor Feedback & Reviews</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          <FilterIcon size={20} />
          Filter
        </button>
      </div>

      {/* Mentor Cards */}
      <div className="space-y-6">
        {mentorFeedback.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-md p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {feedback.mentor.split(" ")[0][0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{feedback.mentor}</h3>
                  <p className="text-sm text-gray-600">{feedback.totalFeedback} feedback submissions</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(feedback.ratingAverage) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold text-gray-900">{feedback.ratingAverage}</p>
                <p className="text-xs text-gray-600">Average Rating</p>
              </div>
            </div>

            {/* Category Ratings */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-4">Rating Breakdown</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(feedback.categories).map(([category, rating]) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 capitalize">{category}</span>
                      <span className="text-sm font-semibold text-gray-900">{rating}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Comments */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Recent Comments</p>
              <div className="space-y-2">
                {feedback.recentComments.map((comment, idx) => (
                  <p key={idx} className="text-sm text-gray-600 italic">"{comment}"</p>
                ))}
              </div>
            </div>

            {/* Action */}
            <button className="text-blue-600 hover:underline text-sm font-semibold">
              View All Feedback →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
