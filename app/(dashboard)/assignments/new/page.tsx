'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, BookOpen, Building } from "lucide-react";

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

  useEffect(() => {
    Promise.all([
      fetchMentors(),
      fetchStudents(),
      fetchDepartments()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/mentors');
      if (res.ok) setMentors(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
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
    setSubmitting(true);
    setError(null);

    try {
      // Get admin user for assignedById
      const usersRes = await fetch('/api/users');
      const users = await usersRes.json();
      const admin = users.find((u: any) => u.role.name === 'super_admin' || u.role.name === 'admin');

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdById: admin?.id || users[0]?.id
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create assignment');
      }

      alert('Assignment created successfully!');
      router.push('/assignments');
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading details...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Mentor Assignment</h1>

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mentor *</label>
            <select
              name="mentorId"
              value={formData.mentorId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Mentor</option>
              {mentors.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student *</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Assignment'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
