import type { Metadata } from "next";
import { Settings, Database, Bell, HardDrive, RefreshCw, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "System Settings - SMMS",
};

export default function SystemSettingsPage() {
  const systemInfo = {
    version: "1.0.0",
    build: "Build 2024.01",
    environment: "Production",
    database: "MySQL 8.0",
    lastBackup: "Today at 2:30 AM",
    storageUsed: "2.4 GB of 5 GB",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">System Settings</h1>

      <div className="max-w-4xl space-y-6">
        {/* System Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings size={24} className="text-blue-600" />
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Application Version</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{systemInfo.version}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Build</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{systemInfo.build}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Environment</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {systemInfo.environment}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Database</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{systemInfo.database}</p>
            </div>
          </div>
        </div>

        {/* Backup & Storage */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HardDrive size={24} className="text-blue-600" />
            Backup & Storage
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Storage Usage</span>
                <span className="text-sm text-gray-600">{systemInfo.storageUsed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: "48%" }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Last Backup</p>
              <p className="text-sm text-gray-600 mb-4">{systemInfo.lastBackup}</p>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                  <RefreshCw size={18} />
                  Backup Now
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                  <Download size={18} />
                  Download Backup
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">API Server</p>
                <p className="text-xs text-green-700">Response time: 45ms</p>
              </div>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Database</p>
                <p className="text-xs text-green-700">Connection stable</p>
              </div>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Authentication Service</p>
                <p className="text-xs text-green-700">All systems operational</p>
              </div>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={24} className="text-blue-600" />
            Email Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
              <input
                type="text"
                defaultValue="smtp.gmail.com"
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
              <input
                type="email"
                defaultValue="noreply@smms.edu"
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <button className="px-4 py-2 text-blue-600 hover:underline text-sm font-semibold">
              Test Email Configuration
            </button>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Logs</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
            <p className="text-green-600">[2024-01-15 10:30:45] System health check passed</p>
            <p className="text-green-600">[2024-01-15 10:15:22] Backup completed successfully</p>
            <p className="text-blue-600">[2024-01-15 09:45:10] User session created</p>
            <p className="text-green-600">[2024-01-15 09:30:05] Database optimization completed</p>
            <p className="text-blue-600">[2024-01-15 08:20:30] API endpoint accessed</p>
            <p className="text-yellow-600">[2024-01-15 07:15:45] High memory usage detected</p>
            <p className="text-green-600">[2024-01-14 23:55:20] Scheduled maintenance completed</p>
          </div>
          <button className="mt-4 text-blue-600 hover:underline text-sm font-semibold">View All Logs →</button>
        </div>
      </div>
    </div>
  );
}

