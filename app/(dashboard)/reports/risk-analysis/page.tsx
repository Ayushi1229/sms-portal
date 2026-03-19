'use client';

import { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  User,
  Activity,
  Filter,
  RefreshCcw,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

interface Student {
  id: string;
  name: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  department: string;
  email: string;
  enrollmentNumber: string;
}

export default function RiskAnalysisPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/students');
      if (res.ok) {
        setStudents(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const highRisk = students.filter(s => s.riskLevel === 'HIGH');
  const mediumRisk = students.filter(s => s.riskLevel === 'MEDIUM');
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.enrollmentNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <AlertTriangle className="text-rose-500 w-8 h-8" />
            Risk Analysis
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Prioritising student interventions based on risk signals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStudents}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-rose-500 transition-all shadow-sm"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6">
          <p className="text-rose-600 text-xs font-black uppercase tracking-widest mb-1">High Risk</p>
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-rose-900">{highRisk.length}</h2>
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-rose-900/40 text-[10px] font-bold mt-2">Requires immediate attention</p>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6">
          <p className="text-orange-600 text-xs font-black uppercase tracking-widest mb-1">Medium Risk</p>
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-orange-900">{mediumRisk.length}</h2>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-orange-900/40 text-[10px] font-bold mt-2">Monitoring recommended</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6">
          <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-1">Stable</p>
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-emerald-900">{students.length - highRisk.length - mediumRisk.length}</h2>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-emerald-900/40 text-[10px] font-bold mt-2">No active interventions</p>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-gray-900">Student Risk Registry</h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-500 w-full md:w-72"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
              <div key={s.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50/50 transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${
                    s.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                    s.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 uppercase tracking-tight">{s.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><User size={12} /> {s.enrollmentNumber}</span>
                      <span className="flex items-center gap-1"><LayoutGrid size={12} /> {s.department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 mt-4 md:mt-0">
                  <div className="text-right">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      s.riskLevel === 'HIGH' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' :
                      s.riskLevel === 'MEDIUM' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' :
                      'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                    }`}>
                      {s.riskLevel} RISK
                    </span>
                  </div>
                  <Link href={`/students?search=${s.enrollmentNumber}`}>
                    <button className="p-3 rounded-xl bg-gray-100 text-gray-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400 font-medium">
              {loading ? "Crunching risk data..." : "No students match your search criteria."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
