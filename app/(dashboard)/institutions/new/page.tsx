'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Hash,
  Zap,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function NewInstitutionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      code: formData.get("code"),
      address: formData.get("address"),
      contactEmail: formData.get("contactEmail"),
    };

    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/institutions"), 2000);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to create institution");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-100 mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Institution Provisioned</h2>
        <p className="text-gray-500 font-medium">Redirecting to the enterprise hub...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation */}
      <Link href="/institutions" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all">
        <ArrowLeft size={16} />
        Back to Hub
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em]">
          <Zap size={14} className="fill-indigo-600" />
          Provisioning Engine
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add New Entity</h1>
        <p className="text-gray-500 font-medium font-inter">Initialize a new institutional ecosystem within the Smms framework.</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm flex items-center gap-3">
              <ShieldCheck size={20} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Institution Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Building2 size={12} />
                Full Legal Name
              </label>
              <input
                required
                name="name"
                type="text"
                placeholder="e.g. Royal Institute of Oceanography"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50/50 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-inner"
              />
            </div>

            {/* Entity Code */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Hash size={12} />
                Strategic System Code
              </label>
              <input
                required
                name="code"
                type="text"
                placeholder="e.g. RIO-2024"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50/50 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-inner"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} />
                Administrative Gateway
              </label>
              <input
                required
                name="contactEmail"
                type="email"
                placeholder="admin@institution.edu"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50/50 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-inner"
              />
            </div>

            {/* Geographical Location */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin size={12} />
                Primary Headquarters
              </label>
              <input
                required
                name="address"
                type="text"
                placeholder="City, Country"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50/50 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-inner"
              />
            </div>
          </div>

          {/* Submission Area */}
          <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 bg-indigo-50/50 px-4 py-3 rounded-xl border border-indigo-100/30">
              <ShieldCheck size={18} className="text-indigo-600" />
              <p className="text-[10px] font-bold text-indigo-900/60 uppercase tracking-tight">Authorization Verified for Super Admin Level</p>
            </div>
            
            <button
              disabled={loading}
              type="submit"
              className="w-full md:w-auto min-w-[240px] flex items-center justify-center gap-2 bg-gray-900 text-white px-10 py-5 rounded-2xl hover:bg-indigo-600 transition-all shadow-2xl shadow-gray-200 font-extrabold tracking-tight disabled:opacity-50"
            >
              {loading ? (
                <RefreshCcw size={20} className="animate-spin" />
              ) : (
                <>
                  <Zap size={20} className="fill-white" />
                  Finalize Provisioning
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
