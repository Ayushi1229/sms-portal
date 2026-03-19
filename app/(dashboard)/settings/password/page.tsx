"use client";

import { useState } from "react";
import { Eye, EyeOff, Save, AlertCircle, Key, History, CheckCircle2 } from "lucide-react";

export default function PasswordSettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="max-w-4xl pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Security Credentials</h1>
        <p className="text-gray-500 mt-2 font-medium">Update your password to keep your account secure and protected.</p>
      </div>

      <div className="space-y-6">
        {/* Password Update Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 shadow-blue-50/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Key size={20} />
            </div>
            Update Password
          </h3>
          
          <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4">
            <AlertCircle className="text-blue-600 shrink-0" size={24} />
            <div>
              <p className="text-sm font-bold text-blue-900 leading-none">Security Guidelines</p>
              <p className="text-sm text-blue-700/80 mt-1.5 leading-relaxed">
                Ensure your password is at least 8 characters long and includes a mix of uppercase, lowercase, numbers, and symbols for maximum protection.
              </p>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Authentication Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-sm font-bold text-blue-600 mt-2.5 hover:underline cursor-pointer inline-block">Forgot password?</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Security Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Complexity Status</span>
                    <span className="text-xs font-bold text-green-600">Strong</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-1.5 flex-1 bg-green-500 rounded-full shadow-sm"></div>
                    <div className="h-1.5 flex-1 bg-green-500 rounded-full shadow-sm"></div>
                    <div className="h-1.5 flex-1 bg-green-500 rounded-full shadow-sm"></div>
                    <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Verify Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 active:scale-95"
              >
                <Save size={20} />
                Confirm Changes
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none py-4 px-10 bg-white border-2 border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all font-bold active:scale-95"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* History Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-slate-50/50">
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <History size={20} />
              </div>
              Recent Security Activity
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { type: "Password changed", date: "3 months ago", status: "Verified" },
              { type: "Password changed", date: "6 months ago", status: "Verified" },
              { type: "Account initialized", date: "1 year ago", status: "System" },
            ].map((log, i) => (
              <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="text-base font-bold text-gray-900">{log.type}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{log.date}</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
