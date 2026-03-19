"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, Smartphone, MapPin, Trash2, LogOut, ChevronRight, AlertTriangle } from "lucide-react";

interface Device {
  id: number;
  name: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function SecuritySettingsPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);

  useEffect(() => {
    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Unknown Browser";
      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Edg")) browser = "Edge";
      else if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari")) browser = "Safari";
      
      let os = "Unknown OS";
      if (ua.includes("Win")) os = "Windows";
      else if (ua.includes("Mac")) os = "MacOS";
      else if (ua.includes("Linux")) os = "Linux";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
      
      return `${browser} on ${os}`;
    };

    let tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
    let locationName = tz === "Asia/Calcutta" || tz === "Asia/Kolkata" 
      ? "Gujarat, India" 
      : tz.replace("_", " ").split("/").pop() || "India";

    const activeDeviceName = getBrowserInfo();

    setDevices([
      {
        id: 1,
        name: activeDeviceName,
        location: locationName,
        lastActive: "Active now",
        isCurrent: true,
      }
    ]);

    setLoginAttempts([
      { id: 1, date: "Today", time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), status: "Success", device: activeDeviceName },
      { id: 2, date: "2 days ago", time: "2:15 PM", status: "Failed", device: "Unknown Device" },
    ]);
  }, []);

  return (
    <div className="max-w-4xl pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Security Settings</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your account security and trusted sessions.</p>
      </div>

      <div className="space-y-6">
        {/* Active Sessions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start gap-4 mb-2">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Smartphone size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Active Sessions</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your active sessions on different devices. You can securely log out of any unexpected devices.</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {devices.map((device) => (
              <div key={device.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-base font-semibold text-gray-900">{device.name}</p>
                    {device.isCurrent && (
                      <span className="px-2.5 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider">
                        This device
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin size={16} className="text-gray-400" />
                      {device.location}
                    </div>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <p className={`text-sm font-medium ${device.isCurrent ? "text-green-600" : "text-gray-500"}`}>
                      {device.lastActive}
                    </p>
                  </div>
                </div>
                {!device.isCurrent && (
                  <button className="flex items-center justify-center p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all h-fit group">
                    <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <button className="text-red-600 hover:text-red-700 text-sm font-semibold hover:underline">
              Sign out of all other sessions
            </button>
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-xl shrink-0">
                <Lock size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Login History</h3>
                <p className="text-sm text-gray-500 mt-1">Review recently successful and failed login attempts.</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left align-middle">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs tracking-wider uppercase">
                <tr>
                  <th className="py-4 px-8 font-medium">Date & Time</th>
                  <th className="py-4 px-8 font-medium">Device</th>
                  <th className="py-4 px-8 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loginAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-8 whitespace-nowrap">
                      <p className="text-gray-900 font-medium">{attempt.date} <span className="text-gray-400 mx-1">•</span> <span className="text-gray-600">{attempt.time}</span></p>
                    </td>
                    <td className="py-4 px-8 whitespace-nowrap">
                      <span className="text-gray-600 font-medium">{attempt.device}</span>
                    </td>
                    <td className="py-4 px-8 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        attempt.status === "Success"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {attempt.status === "Failed" && <AlertTriangle size={12} className="mr-1.5" />}
                        {attempt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gradient-to-br from-red-50/50 to-orange-50/50 border border-red-100 rounded-2xl overflow-hidden mt-10">
          <div className="p-8">
            <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
              Danger Zone
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-sm border border-red-50/50">
                <div>
                  <p className="text-base font-bold text-red-900">Deactivate Account</p>
                  <p className="text-sm text-red-700/80 mt-1">Temporarily block access to your account.</p>
                </div>
                <button className="shrink-0 px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all font-semibold active:scale-95 shadow-sm hover:shadow">
                  Deactivate
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-red-600 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <p className="text-base font-bold text-white">Delete Account</p>
                  <p className="text-sm text-red-100 mt-1">Permanently obliterate your account and data.</p>
                </div>
                <button className="shrink-0 group flex items-center gap-2 px-6 py-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all font-bold active:scale-95 shadow">
                  <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

