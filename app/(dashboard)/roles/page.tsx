'use client';

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Users, 
  Plus, 
  Search, 
  RefreshCcw,
  ChevronRight,
  ShieldAlert,
  Lock,
  Zap,
  LayoutGrid,
  MoreVertical,
  Edit2,
  Trash2,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Role {
  id: number;
  name: string;
  description: string;
  _count?: {
    users: number;
  };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles');
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editingRole) {
      setFormData({ 
        name: editingRole.name, 
        description: editingRole.description || '' 
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [editingRole]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const url = editingRole ? `/api/roles/${editingRole.id}` : '/api/roles';
      const method = editingRole ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save role');
      }

      await fetchRoles();
      setIsModalOpen(false);
      setEditingRole(null);
    } catch (err) {
      console.error('Error saving role:', err);
      alert(err instanceof Error ? err.message : 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBranding = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('super admin')) return { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", label: "Ecosystem Overseer" };
    if (n.includes('institutional admin')) return { color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", label: "Sector Manager" };
    if (n.includes('department admin')) return { color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", label: "Unit Controller" };
    if (n.includes('mentor')) return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Knowledge Guide" };
    if (n.includes('student')) return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", label: "Talent Node" };
    return { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-100", label: "Custom Role" };
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = [
    { label: "Role Tiers", value: roles.length, icon: ShieldCheck, color: "text-indigo-600" },
    { label: "Secured Nodes", value: roles.reduce((acc, r) => acc + (r._count?.users || 0), 0), icon: Lock, color: "text-rose-600" },
    { label: "Active Access", value: "99.9%", icon: Zap, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Roles & Tiers
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Define and manage the hierarchy of access roles within the ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchRoles}
            className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-rose-600 hover:shadow-lg transition-all"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => {
              setEditingRole(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition shadow-xl shadow-gray-200 font-bold tracking-tight"
          >
            <Plus size={20} />
            Define New Role
          </button>
        </div>
      </div>

      {/* Stats QuickView */}
      <div className="flex flex-wrap gap-8 items-center bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-4 pr-8 border-r border-gray-100 last:border-0">
            <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <h4 className="text-xl font-black text-gray-900 leading-none">{loading ? '...' : stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-rose-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Filter roles by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm focus:ring-4 focus:ring-rose-50 focus:border-rose-100 transition-all font-bold placeholder:text-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role) => {
              const brand = getRoleBranding(role.name);
              return (
                <div key={role.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${brand.bg} ${brand.color} flex items-center justify-center shadow-sm`}>
                      <ShieldCheck size={28} />
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           setEditingRole(role);
                           setIsModalOpen(true);
                         }}
                         className="p-2 hover:bg-gray-50 rounded-lg text-gray-300 hover:text-rose-600 transition-colors"
                       >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${brand.color}`}>
                      {brand.label}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-rose-600 transition-colors">
                      {role.name}
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8 line-clamp-2">
                    {role.description || "Core infrastructure role governing fundamental system operations and data flow."}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400">{i}</div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {role._count?.users || 0} Nodes
                      </span>
                    </div>
                    <button 
                      onClick={() => router.push(`/roles/${role.id}`)}
                      className="flex items-center gap-1.5 text-xs font-black text-rose-600 uppercase tracking-widest hover:gap-2 transition-all"
                    >
                      Configure
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
      </div>

      {/* Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {editingRole ? 'Update Role' : 'Define New Role'}
                  </h3>
                  <p className="text-sm font-medium text-gray-400 mt-1">
                    {editingRole ? 'Modify existing system access tier.' : 'Establish a new access tier in the ecosystem.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-rose-600 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Role Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-rose-50 transition-all font-bold placeholder:text-gray-200"
                    placeholder="e.g. Senior Mentor"
                    disabled={!!(editingRole && editingRole.id <= 5)}
                  />
                  {editingRole && editingRole.id <= 5 && (
                    <p className="text-[10px] text-amber-500 font-bold ml-4 mt-1 uppercase tracking-wider">Note: System roles cannot be renamed.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-rose-50 transition-all font-bold placeholder:text-gray-200 resize-none"
                    placeholder="Describe the responsibilities and access scope..."
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 group"
                  >
                    {saving ? 'Processing...' : editingRole ? 'Update Role Tier' : 'Establish Role Tier'}
                    {!saving && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
