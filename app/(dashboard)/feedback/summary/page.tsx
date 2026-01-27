import type { Metadata } from "next";
import { TrendingUp, Users, MessageCircle, Star, BarChart3, PieChart } from "lucide-react";

export const metadata: Metadata = {
  title: "Feedback Summary - SMMS",
};

export default function FeedbackSummaryPage() {
  const summaryStats = [
    { label: "Total Feedback", value: "127", icon: MessageCircle, change: "+12% from last month" },
    { label: "Average Rating", value: "4.4", icon: Star, change: "+0.2 from last month" },
    { label: "Total Mentors", value: "24", icon: Users, change: "100% participation" },
    { label: "Satisfaction Rate", value: "89%", icon: TrendingUp, change: "+5% from last month" },
  ];

  const topMentors = [
    { name: "Dr. Sarah Johnson", rating: 4.7, feedbacks: 24 },
    { name: "Dr. Ahmed Hassan", rating: 4.5, feedbacks: 18 },
    { name: "Prof. Michael Chen", rating: 4.3, feedbacks: 15 },
  ];

  const feedbackTrends = [
    { month: "Oct", rating: 4.1 },
    { month: "Nov", rating: 4.2 },
    { month: "Dec", rating: 4.3 },
    { month: "Jan", rating: 4.4 },
  ];

  const categoryBreakdown = [
    { category: "Communication", percentage: 92, color: "bg-blue-500" },
    { category: "Knowledge", percentage: 95, color: "bg-green-500" },
    { category: "Helpfulness", percentage: 88, color: "bg-purple-500" },
    { category: "Engagement", percentage: 85, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Feedback Summary & Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <Icon className="text-blue-600" size={28} />
              </div>
              <p className="text-xs text-green-600 font-semibold">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rating Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600" />
            Rating Trends
          </h3>
          <div className="flex items-end justify-between h-64 border-b-2 border-gray-200 pb-4">
            {feedbackTrends.map((trend) => (
              <div key={trend.month} className="flex flex-col items-center gap-2">
                <div
                  className="bg-blue-600 rounded-lg transition hover:bg-blue-700"
                  style={{
                    width: "40px",
                    height: `${(trend.rating / 5) * 150}px`,
                  }}
                ></div>
                <span className="text-xs font-semibold text-gray-600">{trend.month}</span>
                <span className="text-xs text-gray-500">{trend.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-600" />
            Category Breakdown
          </h3>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                  <span className="text-sm font-bold text-gray-900">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${cat.color} h-3 rounded-full transition`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Mentors */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Rated Mentors</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mentor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Average Rating</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Feedback</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {topMentors.map((mentor, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{mentor.name}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(mentor.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                      <span className="ml-2 font-semibold text-gray-900">{mentor.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{mentor.feedbacks} reviews</td>
                  <td className="py-4 px-4">
                    <button className="text-blue-600 hover:underline text-sm font-semibold">View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

