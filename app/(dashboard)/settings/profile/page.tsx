"use client";

import { useState } from "react";
import { Camera, Save, X, User, Briefcase, Info, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { RoleNames } from "@/lib/auth/permissions";

export default function ProfileSettingsPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const firstName = user?.profile?.firstName || "Ayushi";
  const lastName = user?.profile?.lastName || "";
  const initial = firstName.charAt(0).toUpperCase();
  const userRole = user ? RoleNames[user.roleId] || "Department Admin" : "Department Admin";
  const email = user?.email || "ayushi@example.com";
  const phone = (user?.profile as any)?.phone || "+1 (555) 123-4567";
  const userDepartment = (user as any)?.department?.name || "Unassigned";
  const employeeId = (user as any)?.studentProfile?.rollNumber || user?.id?.substring(0, 8).toUpperCase() || "EMP-N/A";
  const specialization = (user?.profile as any)?.title || "General";
  const bio = (user?.profile as any)?.bio || "I am a dedicated member of the team.";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const updates = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      bio: formData.get("bio"),
      title: formData.get("title"), 
    };

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      await refreshUser();
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your public information and account details.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <Info size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 shadow-blue-50/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Camera size={20} />
            </div>
            Display Profile
          </h3>
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 ring-4 ring-white transition-transform group-hover:scale-105">
                <span className="text-4xl text-white font-bold">{initial}</span>
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2.5 rounded-xl shadow-md hover:bg-blue-600 hover:text-white transition-all transform hover:rotate-12 border border-blue-50">
                <Camera size={18} />
              </button>
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">Avatar Image</p>
              <p className="text-sm text-gray-500 mt-1">Recommended: 400x400px. JPG, PNG or GIF.</p>
              <button type="button" className="text-red-500 hover:text-red-600 text-sm font-bold mt-2 hover:underline">Remove Avatar</button>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 shadow-indigo-50/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <User size={20} />
            </div>
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                defaultValue={firstName}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                defaultValue={lastName}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                defaultValue={email}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Primary Phone</label>
              <input
                type="tel"
                name="phone"
                defaultValue={phone}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                defaultValue=""
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Short Bio</label>
              <textarea
                name="bio"
                defaultValue={bio}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800 resize-none"
                placeholder="Tell us a bit about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 shadow-slate-100/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <Briefcase size={20} />
            </div>
            Professional Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Designated Role</label>
              <input
                type="text"
                value={userRole}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={userDepartment}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Institutional ID</label>
              <input
                type="text"
                value={employeeId}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                name="title"
                defaultValue={specialization}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 pt-6">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSaving ? "Updating Details..." : "Save Profile Details"}
          </button>
          <button type="button" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-600 px-10 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold active:scale-95">
            <X size={20} />
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}
