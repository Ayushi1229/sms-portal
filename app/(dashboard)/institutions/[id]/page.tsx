'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, 
  ArrowLeft, 
  Users, 
  LayoutGrid, 
  Calendar,
  ShieldCheck,
  Settings,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Zap
} from "lucide-react";
import Link from "next/link";

interface Department {
  id: string;
  name: string;
  _count: {
    users: number;
  };
}

interface InstitutionDetail {
  id: string;
  name: string;
  code: string;
  address: string;
  contactEmail: string;
  departments: Department[];
  _count: {
    departments: number;
    users: number;
  };
}

export default function InstitutionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [institution, setInstitution] = useState<InstitutionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/institutions/${id}`);
        if (res.ok) {
          const data = await res.json();
          setInstitution(data);
        }
      } catch (err) {
        console.error("Failed to fetch institution detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center">
          <Building2 size={32} className="text-indigo-200" />
        </div>
        <div className="h-4 w-48 bg-gray-50 rounded-full"></div>
        <div className="h-3 w-32 bg-gray-50/50 rounded-full"></div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-50 rounded-full blur-3xl opacity-50 scale-150"></div>
          <div className="relative w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-indigo-50">
            <ShieldCheck size={48} className="text-indigo-600 opacity-20" />
            <Building2 size={48} className="text-indigo-400 absolute -bottom-2 -right-2" />
          </div>
        </div>
        
        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
          Entity Not Found
        </h2>
        <p className="text-gray-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
          The institutional node you are looking for has either been decommissioned or moved to a different sector. Please verify the ID and try again.
        </p>
        
        <Link href="/institutions">
          <button className="flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl hover:bg-black transition-all shadow-2xl shadow-gray-200 font-black uppercase tracking-widest text-[10px]">
            <ArrowLeft size={16} />
            Return to Institutional Hub
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <Link href="/institutions" className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all mb-2">
            <ArrowLeft size={14} />
            Back to Institutional Hub
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50">
              <Building2 size={36} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Operational
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-mono text-[10px] font-black rounded-lg uppercase">
                  CODE: {institution.code}
                </span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                {institution.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white border border-gray-100 text-gray-900 px-8 py-4 rounded-2xl hover:shadow-xl transition-all font-bold">
            <Settings size={20} className="text-gray-400" />
            Control Panel
          </button>
          <button className="flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-2xl hover:bg-black transition shadow-2xl shadow-gray-200 font-bold">
            <ShieldCheck size={20} />
            Security Audit
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <LayoutGrid size={24} className="text-blue-600 mb-6 relative z-10" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Active Depts</p>
          <h3 className="text-4xl font-black text-gray-900 relative z-10">{institution._count.departments}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50/50 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <Users size={24} className="text-violet-600 mb-6 relative z-10" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Total Talent</p>
          <h3 className="text-4xl font-black text-gray-900 relative z-10">{institution._count.users}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <MapPin size={24} className="text-indigo-600 mb-6 relative z-10" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Location Hub</p>
          <h3 className="text-lg font-black text-gray-900 relative z-10 truncate">{institution.address}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <Zap size={24} className="text-emerald-600 mb-6 relative z-10" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Status Health</p>
          <h3 className="text-4xl font-black text-gray-900 relative z-10">98%</h3>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Department Ecosystem */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <LayoutGrid size={24} className="text-indigo-600" />
              Department Ecosystem
            </h2>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Units</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institution.departments.length > 0 ? (
              institution.departments.map((dept) => (
                <div key={dept.id} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:border-indigo-100 hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {dept.name.charAt(0)}
                    </div>
                    <ChevronRight size={18} className="text-gray-200 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900 mb-1">{dept.name}</h4>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">{dept._count.users} Members</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <LayoutGrid size={48} className="mb-4 opacity-10" />
                <p className="font-bold text-sm uppercase tracking-widest">No units provisioned yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Integration Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/30 rounded-bl-full blur-2xl"></div>
            <ShieldCheck size={32} className="text-indigo-400 mb-8" />
            <h3 className="text-xl font-black mb-2">Security Gateway</h3>
            <p className="text-indigo-200/60 text-sm font-medium leading-relaxed mb-8">
              All data within this entity is encrypted under global institutional protocols.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-white/50">Admin Access</span>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Active</span>
              </div>
              <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all">
                Access Audit Terminal
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Administrative Contact</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-50">
                <Mail size={20} />
              </div>
              <div className="truncate">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">System Email</p>
                <p className="text-sm font-bold text-gray-900 truncate">{institution.contactEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
