import type { Metadata } from "next";
import { Shield, Lock, Smartphone, MapPin, Trash2, LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "Security Settings - SMMS",
};

export default function SecuritySettingsPage() {
  const devices = [
    { id: 1, name: "Chrome on Windows", location: "New York, USA", lastActive: "Active now", isCurrent: true },
    { id: 2, name: "Safari on iPhone", location: "New York, USA", lastActive: "2 hours ago", isCurrent: false },
    { id: 3, name: "Firefox on Ubuntu", location: "Boston, USA", lastActive: "1 day ago", isCurrent: false },
  ];

  const loginAttempts = [
    { id: 1, date: "Today", time: "10:30 AM", status: "Success", device: "Chrome on Windows" },
    { id: 2, date: "Yesterday", time: "3:45 PM", status: "Success", device: "Safari on iPhone" },
    { id: 3, date: "2 days ago", time: "11:20 AM", status: "Success", device: "Firefox on Ubuntu" },
    { id: 4, date: "2 days ago", time: "2:15 PM", status: "Failed", device: "Unknown Device" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Security Settings</h1>

      <div className="max-w-4xl space-y-6">
        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={24} className="text-blue-600" />
            Two-Factor Authentication
          </h3>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              <p className="text-xs text-gray-500 mt-1">Requires authentication app or SMS verification</p>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              Enable 2FA
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Smartphone size={24} className="text-blue-600" />
            Active Sessions
          </h3>
          <p className="text-sm text-gray-600 mb-4">Manage your active sessions on different devices</p>
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{device.name}</p>
                    {device.isCurrent && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        This device
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <MapPin size={14} />
                    {device.location}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{device.lastActive}</p>
                </div>
                {!device.isCurrent && (
                  <button className="text-red-600 hover:text-red-700 p-2">
                    <LogOut size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="mt-4 text-red-600 hover:underline text-sm font-semibold">Sign out all other sessions</button>
        </div>

        {/* Login History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={24} className="text-blue-600" />
            Login History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Device</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {loginAttempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="text-gray-900">{attempt.date} at {attempt.time}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{attempt.device}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        attempt.status === "Success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {attempt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked IP Addresses</h3>
          <p className="text-sm text-gray-600 mb-4">No IP addresses are currently blocked</p>
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold">
            Block an IP
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">Deactivate Account</p>
                <p className="text-xs text-red-700 mt-1">Temporarily deactivate your account</p>
              </div>
              <button className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold">
                Deactivate
              </button>
            </div>
            <div className="border-t border-red-200 pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">Delete Account</p>
                <p className="text-xs text-red-700 mt-1">Permanently delete your account and data</p>
              </div>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2">
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

