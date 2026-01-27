import type { Metadata } from "next";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Alerts - SMMS",
};

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      student: "Carol Smith",
      type: "At Risk",
      severity: "High",
      message: "Student showing signs of academic struggle",
      createdAt: "2026-01-27",
      status: "Open",
    },
    {
      id: 2,
      student: "Bob Davis",
      type: "Attendance",
      severity: "Medium",
      message: "Multiple missed mentoring sessions",
      createdAt: "2026-01-26",
      status: "Open",
    },
    {
      id: 3,
      student: "Alice Johnson",
      type: "Achievement",
      severity: "Low",
      message: "Excellent project submission",
      createdAt: "2026-01-25",
      status: "Resolved",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Alerts & Notifications</h1>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-red-600 font-semibold">High Severity</p>
              <p className="text-2xl font-bold text-red-900">1</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="text-sm text-yellow-600 font-semibold">Medium Severity</p>
              <p className="text-2xl font-bold text-yellow-900">1</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-blue-600 font-semibold">Open Alerts</p>
              <p className="text-2xl font-bold text-blue-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-green-600 font-semibold">Resolved</p>
              <p className="text-2xl font-bold text-green-900">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`rounded-lg p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {alert.severity === "High" && <AlertCircle className="text-red-600" size={20} />}
                  {alert.severity === "Medium" && <Clock className="text-yellow-600" size={20} />}
                  {alert.severity === "Low" && <CheckCircle className="text-green-600" size={20} />}
                  <h3 className="font-semibold text-gray-900">{alert.type} - {alert.student}</h3>
                </div>
                <p className="text-gray-700 mb-2">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.createdAt}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  alert.status === "Open" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                }`}>
                  {alert.status}
                </span>
                <button className="text-sm text-blue-600 hover:underline">Review</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
