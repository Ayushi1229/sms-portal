'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  BookOpen, 
  Building, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Users
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Role } from "@/lib/auth/permissions";

interface Mentor {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

export default function NewAssignmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    mentorId: '',
    studentId: '',
    departmentId: '',
  });

  // Pre-fill department for Admins or Mentors
  useEffect(() => {
    if (user && (user.roleId === Role.DEPARTMENT_ADMIN || user.roleId === Role.MENTOR) && user.departmentId) {
      setFormData(prev => ({ ...prev, departmentId: user.departmentId! }));
      // If it's a mentor, we also pre-fill the mentorId
      if (user.roleId === Role.MENTOR) {
        setFormData(prev => ({ ...prev, mentorId: user.id }));
      }
    }
  }, [user]);

  const isLocked = user && (user.roleId === Role.DEPARTMENT_ADMIN || user.roleId === Role.MENTOR);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchDepartments()
      ]);
      setLoading(false);
    };
    init();
  }, []);

  // Fetch mentors and students when department changes
  useEffect(() => {
    const fetchDeptData = async () => {
      if (formData.departmentId) {
        setLoading(true);
        await Promise.all([
          fetchMentors(formData.departmentId),
          fetchStudents(formData.departmentId)
        ]);
        setLoading(false);
      } else {
        setMentors([]);
        setStudents([]);
      }
    };
    fetchDeptData();
  }, [formData.departmentId]);

  const fetchMentors = async (deptId: string) => {
    try {
      const res = await fetch(`/api/mentors?departmentId=${deptId}`);
      if (res.ok) setMentors(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async (deptId: string) => {
    try {
      const res = await fetch(`/api/students?departmentId=${deptId}`);
      if (res.ok) setStudents(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      if (res.ok) setDepartments(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Final check for mentorId if it's a mentor
    let finalMentorId = formData.mentorId;
    if (user?.roleId === Role.MENTOR && !finalMentorId) {
        finalMentorId = user.id;
    }

    if (!finalMentorId || !formData.studentId || !formData.departmentId) {
      setError("Please ensure both a student and department are selected.");
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        mentorId: finalMentorId
      };

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create assignment');
      }

      router.push('/assignments');
      router.refresh();
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isDeptAdmin = user?.roleId === Role.DEPARTMENT_ADMIN;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-200 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold">Back to Assignments</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Users className="w-8 h-8" />
              New Assignment
            </h1>
            <p className="text-blue-100 mt-2 font-medium">Link a mentor with a student to begin their journey.</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3 text-rose-700 animate-in shake duration-300">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Building size={14} className="text-blue-600" />
                Department
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-gray-900 appearance-none"
              >
                <option value="">Choose Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className={`space-y-2 ${!formData.departmentId && 'opacity-30 pointer-events-none'}`}>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={14} className="text-indigo-600" />
                Mentor
              </label>
              <select
                name="mentorId"
                value={formData.mentorId}
                onChange={handleChange}
                required
                disabled={user?.roleId === Role.MENTOR}
                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-gray-900 appearance-none disabled:opacity-75"
              >
                <option value="">Select Mentor</option>
                {mentors.map(m => (
                  <option key={m.id} value={m.id}>{m.name} {m.id === user?.id ? '(You)' : ''}</option>
                ))}
              </select>
              {user?.roleId === Role.MENTOR && (
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tight px-2">Assigning to yourself</p>
              )}
            </div>

            <div className={`space-y-2 ${!formData.departmentId && 'opacity-30 pointer-events-none'}`}>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={14} className="text-emerald-600" />
                Student
              </label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-2xl hover:bg-blue-700 transition-all font-black uppercase tracking-widest shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Confirm Assignment
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-50 text-gray-500 py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all font-black uppercase tracking-widest border-2 border-transparent hover:border-gray-200"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
