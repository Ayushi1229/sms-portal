'use client';

import { useEffect, useState, use } from "react";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Save, 
  Lock, 
  Eye, 
  Edit3, 
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

interface Role {
  id: number;
  name: string;
  description: string;
  _count?: {
    users: number;
  };
}

export default function RoleConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRole();
  }, [id]);

  const fetchRole = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/roles`);
      if (!response.ok) throw new Error('Failed to fetch role data');
      const roles = await response.json();
      const currentRole = roles.find((r: Role) => r.id.toString() === id);
      if (!currentRole) throw new Error('Role not found');
      setRole(currentRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error || !role) return (
    <div className="p-10 bg-rose-50 rounded-[2.5rem] border border-rose-100 text-center">
      <ShieldAlert className="mx-auto text-rose-600 mb-4" size={48} />
      <h2 className="text-2xl font-black text-gray-900">Access Denied or Not Found</h2>
      <p className="text-gray-500 mt-2 mb-8">{error || 'The requested role configuration is unavailable.'}</p>
      <Link href="/roles" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold transition hover:bg-black">
        Return to Roles
      </Link>
    </div>
  );

  // Mock permissions based on lib/auth/permissions.ts
  const permissions = [
    { category: "User Management", actions: [
      { name: "Create Users", allowed: role.id <= 2 },
      { name: "Edit Users", allowed: role.id <= 3 },
      { name: "Delete Users", allowed: role.id === 1 },
      { name: "View All Users", allowed: role.id <= 2 },
    ]},
    { category: "Institutional Structure", actions: [
      { name: "Manage Institutions", allowed: role.id === 1 },
      { name: "Manage Departments", allowed: role.id <= 2 },
    ]},
    { category: "Mentoring Operations", actions: [
      { name: "Create Sessions", allowed: role.id <= 4 },
      { name: "Record Feedback", allowed: role.id <= 5 },
      { name: "Manage Assignments", allowed: role.id <= 4 },
      { name: "View Reports", allowed: role.id <= 3 },
    ]},
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link 
            href="/roles"
            className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-rose-600 hover:shadow-lg transition-all"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                Configuration
              </span>
              {role.id <= 5 && (
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  System Role
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {role.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition shadow-xl shadow-gray-200 font-bold tracking-tight opacity-50 cursor-not-allowed">
            <Save size={20} />
            Save Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Permission Matrix */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
              <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <Lock className="text-rose-600" size={24} />
                Access Permissions
              </h3>
              <p className="text-xs font-medium text-gray-400">
                Current authorization scope for this role tier.
              </p>
            </div>

            <div className="space-y-12">
              {permissions.map((group, idx) => (
                <div key={idx} className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    {group.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.actions.map((action, actionIdx) => (
                      <div key={actionIdx} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                        <span className="text-sm font-bold text-gray-700">{action.name}</span>
                        {action.allowed ? (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Granted</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-300 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                            <XCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-300">Denied</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4 mb-6">Tier Details</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                <p className="text-sm font-medium text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100/50">
                  {role.description || "No specific description defined for this access tier."}
                </p>
              </div>
              <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 leading-none mb-1">Active Nodes</h4>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{role._count?.users || 0} Users Assigned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
