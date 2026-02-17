'use client';

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Alert {
  id: string;
  student: string;
  type: string;
  severity: string;
  message: string;
  createdAt: string;
  status: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/alerts');
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const highSeverityCount = alerts.filter(a => a.severity === "High").length;
  const mediumSeverityCount = alerts.filter(a => a.severity === "Medium").length;
  const openCount = alerts.filter(a => a.status === "Open").length;
  const resolvedCount = alerts.filter(a => a.status === "Resolved").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading alerts...</span>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-red-900">{highSeverityCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="text-sm text-yellow-600 font-semibold">Medium Severity</p>
              <p className="text-2xl font-bold text-yellow-900">{mediumSeverityCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-blue-600 font-semibold">Open Alerts</p>
              <p className="text-2xl font-bold text-blue-900">{openCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-green-600 font-semibold">Resolved</p>
              <p className="text-2xl font-bold text-green-900">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
            No alerts found.
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg p-4 border-l-4 border-t border-r border-b ${getSeverityColor(alert.severity)}`}>
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
          ))
        )}
      </div>
    </div>
  );
}
