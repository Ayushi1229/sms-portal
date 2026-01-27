import type { Metadata } from "next";
import { BarChart3, TrendingUp, Users, FileText, Download, PlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Reports Dashboard - SMMS",
};

export default function ReportsPage() {
  const reportCategories = [
    {
      name: "Student Progress",
      icon: TrendingUp,
      description: "Track student performance and achievements",
      count: 12,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Mentor Load",
      icon: Users,
      description: "Monitor mentor workload and capacity",
      count: 8,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Attendance",
      icon: FileText,
      description: "Session attendance and participation",
      count: 15,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Risk Analysis",
      icon: BarChart3,
      description: "Identify at-risk students and interventions",
      count: 6,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const recentReports = [
    {
      id: 1,
      title: "Q1 Student Progress Report",
      category: "Student Progress",
      date: "2024-01-14",
      author: "Dr. Sarah Johnson",
      format: "PDF",
    },
    {
      id: 2,
      title: "Mentor Capacity Analysis",
      category: "Mentor Load",
      date: "2024-01-12",
      author: "Admin",
      format: "Excel",
    },
    {
      id: 3,
      title: "December Attendance Summary",
      category: "Attendance",
      date: "2024-01-05",
      author: "System",
      format: "PDF",
    },
    {
      id: 4,
      title: "At-Risk Students Intervention Plan",
      category: "Risk Analysis",
      date: "2023-12-28",
      author: "Dr. Ahmed Hassan",
      format: "Word",
    },
  ];

  const scheduledReports = [
    { name: "Weekly Student Progress", schedule: "Every Monday 9:00 AM", status: "Active" },
    { name: "Monthly Mentor Load", schedule: "1st of each month", status: "Active" },
    { name: "Attendance Report", schedule: "Every Friday", status: "Active" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <PlusIcon size={20} />
          Generate New Report
        </button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reportCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${cat.color}`}>
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{cat.description}</p>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-2xl font-bold text-gray-900">{cat.count}</p>
                <p className="text-xs text-gray-600">available reports</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{report.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {report.category}
                    </span>
                    <span>{report.date}</span>
                    <span>{report.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                    {report.format}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-blue-600 hover:underline text-sm font-semibold">
            View All Reports →
          </button>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
          <div className="space-y-3">
            {scheduledReports.map((report) => (
              <div key={report.name} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 text-sm">{report.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{report.schedule}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-green-600 font-semibold">{report.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:underline text-sm font-semibold">
            Manage Schedules →
          </button>
        </div>
      </div>
    </div>
  );
}
