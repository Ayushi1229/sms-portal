import type { Metadata } from "next";
import { Eye, EyeOff, Save, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Password Settings - SMMS",
};

export default function PasswordSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Password Settings</h1>

      <div className="max-w-2xl bg-white rounded-lg shadow-md p-8">
        {/* Security Alert */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-blue-900">Keep your password secure</p>
            <p className="text-sm text-blue-700 mt-1">Use a strong password with at least 8 characters, including uppercase, lowercase, numbers and symbols.</p>
          </div>
        </div>

        {/* Password Change Form */}
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <Eye size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Forgot your password? <a href="/forgot-password" className="text-blue-600 hover:underline">Reset it here</a></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <Eye size={20} />
              </button>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs font-semibold text-gray-700">Password strength:</p>
              <div className="flex gap-1">
                <div className="h-2 flex-1 bg-green-500 rounded"></div>
                <div className="h-2 flex-1 bg-green-500 rounded"></div>
                <div className="h-2 flex-1 bg-green-500 rounded"></div>
                <div className="h-2 flex-1 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <Eye size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <Save size={20} />
              Update Password
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Password History */}
        <div className="mt-10 pt-10 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Password changed</p>
                <p className="text-xs text-gray-600">3 months ago</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Password changed</p>
                <p className="text-xs text-gray-600">6 months ago</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Account created</p>
                <p className="text-xs text-gray-600">1 year ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
