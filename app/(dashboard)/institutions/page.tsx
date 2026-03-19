'use client';

import { useEffect, useState } from "react";
import { 
  Building2, 
  Users, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  RefreshCcw,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Mail,
  Zap,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";

interface Institution {
  id: string;
  code: string;
  name: string;
  address: string;
  email: string;
  departments: number;
  mentors: number;
  students: number;
  status: string;
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institutions');
      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }
      const data = await response.json();
      setInstitutions(data);
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Global Stats Calculated for Super Admin
  const totalDepts = institutions.reduce((acc, curr) => acc + curr.departments, 0);
  const totalStudents = institutions.reduce((acc, curr) => acc + curr.students, 0);
  const globalUserCount = institutions.reduce((acc, curr) => acc + curr.students + curr.mentors, 0);

  const globalMetrics = [
    { label: "Active Institutions", value: institutions.length, icon: Building2, color: "from-blue-600 to-indigo-600" },
    { label: "Total Departments", value: totalDepts, icon: LayoutGrid, color: "from-indigo-600 to-violet-600" },
    { label: "Global Student Count", value: totalStudents, icon: Users, color: "from-violet-600 to-purple-600" },
    { label: "System Ecosystem", value: globalUserCount, icon: Zap, color: "from-purple-600 to-fuchsia-600" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Super Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Institutional Hub
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage global access and institutional hierarchies across the entire Smms network.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchInstitutions}
            className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:shadow-lg transition-all"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/institutions/new">
            <button className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition shadow-xl shadow-gray-200 font-bold tracking-tight">
              <Plus size={20} />
              Provision New Entity
            </button>
          </Link>
        </div>
      </div>

      {/* Global Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-[0.03] rounded-bl-full`}></div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100">`}>
                <Icon size={26} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{metric.label}</p>
              <h3 className="text-3xl font-black text-gray-900">{loading ? '...' : metric.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Enterprise Filters */}
      <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input
            type="text"
            placeholder="Query institutional data by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-8 py-5 bg-gray-50 border-none rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-gray-500 cursor-pointer appearance-none min-w-[220px]">
            <option>All Ecosystems</option>
            <option>High Scale</option>
            <option>Standard Tier</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 flex items-center gap-4 text-rose-600">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm shadow-rose-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="font-black uppercase tracking-widest text-xs mb-0.5">System Exception</p>
            <p className="font-medium text-sm text-rose-600/80">{error}</p>
          </div>
        </div>
      )}

      {/* Institutions Enterprise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredInstitutions.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-300">
            <Building2 size={64} className="opacity-10 mb-6" />
            <p className="font-bold text-lg uppercase tracking-widest opacity-30">No Entities Found</p>
          </div>
        ) : (
          filteredInstitutions.map((institution) => (
            <div key={institution.id} className="group bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 relative">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{institution.name}</h3>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400 font-black">
                    <span className="bg-gray-50 px-2 py-0.5 rounded text-gray-400">UUID:{institution.id.slice(0, 8)}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-indigo-400 tracking-wider">CODE:{institution.code}</span>
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm shadow-emerald-50">
                  {institution.status}
                </span>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{institution.address}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-bold tracking-tight lowercase">{institution.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-50 relative overflow-hidden">
                <div className="text-center relative z-10">
                  <p className="text-xl font-black text-gray-900">{institution.departments}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Depts</p>
                </div>
                <div className="text-center relative z-10">
                  <p className="text-xl font-black text-gray-900">{institution.mentors}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Faculty</p>
                </div>
                <div className="text-center relative z-10">
                  <p className="text-xl font-black text-gray-900">{institution.students}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Talent</p>
                </div>
                <div className="absolute top-0 left-1/3 bottom-0 w-[1px] bg-gray-200/50"></div>
                <div className="absolute top-0 right-1/3 bottom-0 w-[1px] bg-gray-200/50"></div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

