'use client';

import { useEffect, useState } from "react";
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  RefreshCcw,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Zap,
  GraduationCap
} from "lucide-react";
import Link from "next/link";

interface Department {
  id: string;
  code: string;
  name: string;
  institutionName: string;
  mentors: number;
  students: number;
  totalMembers: number;
  status: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/departments');
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.institutionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalStudents = departments.reduce((acc, curr) => acc + curr.students, 0);
  const totalMentors = departments.reduce((acc, curr) => acc + curr.mentors, 0);

  const metrics = [
    { label: "Active Units", value: departments.length, icon: LayoutGrid, color: "from-blue-600 to-indigo-600" },
    { label: "Total Faculty", value: totalMentors, icon: ShieldCheck, color: "from-indigo-600 to-violet-600" },
    { label: "Talent Pool", value: totalStudents, icon: GraduationCap, color: "from-violet-600 to-purple-600" },
    { label: "Ecosystem Health", value: "Optimal", icon: Zap, color: "from-purple-600 to-fuchsia-600" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Department Hub
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Orchestrate academic units and personnel allocation across the network.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDepartments}
            className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:shadow-lg transition-all"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/departments/new">
            <button className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition shadow-xl shadow-gray-200 font-bold tracking-tight">
              <Plus size={20} />
              Initialize Unit
            </button>
          </Link>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
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

      {/* Filters */}
      <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input
            type="text"
            placeholder="Search departments by name, code or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-8 py-5 bg-gray-50 border-none rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-gray-500 cursor-pointer appearance-none min-w-[220px]">
            <option>All Infrastructures</option>
            <option>Academic</option>
            <option>Support</option>
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

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDepartments.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-300">
            <LayoutGrid size={64} className="opacity-10 mb-6" />
            <p className="font-bold text-lg uppercase tracking-widest opacity-30">No Units Found</p>
          </div>
        ) : (
          filteredDepartments.map((dept) => (
            <div key={dept.id} className="group bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 relative">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{dept.name}</h3>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400 font-black">
                    <span className="text-indigo-400 tracking-wider">UNIT:{dept.code}</span>
                    <span className="text-gray-300">/</span>
                    <span className="bg-gray-50 px-2 py-0.5 rounded text-gray-400 uppercase">{dept.institutionName}</span>
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm shadow-emerald-50">
                  {dept.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-50 relative overflow-hidden mb-8">
                <div className="text-center relative z-10">
                  <p className="text-xl font-black text-gray-900">{dept.mentors}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Faculty</p>
                </div>
                <div className="text-center relative z-10">
                  <p className="text-xl font-black text-gray-900">{dept.students}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Talent</p>
                </div>
                <div className="absolute top-0 left-1/2 bottom-0 w-[1px] bg-gray-200/50"></div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

