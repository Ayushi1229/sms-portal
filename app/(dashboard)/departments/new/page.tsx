'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  ArrowLeft, 
  Plus, 
  ShieldCheck, 
  LayoutGrid,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface Institution {
  id: string;
  name: string;
}

export default function NewDepartmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    institutionId: ""
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch institutions for selection if super admin, or just to verify existence
    const fetchInstitutions = async () => {
      try {
        const res = await fetch('/api/institutions');
        if (res.ok) {
          const data = await res.json();
          setInstitutions(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, institutionId: data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch institutions:", err);
      }
    };
    fetchInstitutions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setMessage("Tactical unit provisioned successfully.");
        setTimeout(() => router.push('/departments'), 2000);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to provision unit");
      }
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : "Internal system error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation */}
      <Link href="/departments" className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
        <ArrowLeft size={14} />
        Back to Structural Hub
      </Link>

      {/* Header Section */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100 ring-8 ring-indigo-50">
          <Plus size={36} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Initialize Unit</h1>
          <p className="text-gray-500 font-medium">Provision a new tactical department within the institutional framework.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-12">
          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-sm space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Unit Nomenclature</label>
                <div className="relative group">
                  <LayoutGrid className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Applied Intelligence"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-14 pr-8 py-5 bg-gray-50/50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">System Code</label>
                <div className="relative group">
                  <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input
                    required
                    type="text"
                    placeholder="e.g. AI-2024"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full pl-14 pr-8 py-5 bg-gray-50/50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Institutional Anchor</label>
                <div className="relative group">
                  <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <select
                    required
                    value={formData.institutionId}
                    onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                    className="w-full pl-14 pr-8 py-5 bg-gray-50/50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all font-bold appearance-none"
                  >
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-500" />
                <p className="text-xs font-bold text-gray-400">Security Clearance Verified: Administrator Level</p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-100 ${
                  loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-indigo-600'
                }`}
              >
                {loading ? 'Initializing...' : 'Confirm Provisioning'}
                {!loading && <CheckCircle2 size={16} />}
              </button>
            </div>

            {status !== 'idle' && (
              <div className={`mt-8 p-6 rounded-[2rem] flex items-center gap-4 animate-in zoom-in duration-300 ${
                status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {status === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                <div>
                  <p className="font-black uppercase tracking-widest text-[10px] mb-0.5">
                    System Response: {status.toUpperCase()}
                  </p>
                  <p className="font-bold text-sm">{message}</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
