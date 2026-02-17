'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface Assignment {
  id: string;
  mentor: string;
  student: string;
  department: string;
}

export default function ScheduleSessionPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    assignmentId: '',
    date: '',
    time: '',
    mode: 'IN_PERSON',
    location: '',
    topic: '',
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/assignments');
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load mentor assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create a combined ISO string for sessionDate
      const sessionDate = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      // In a real app we'd get this from the session
      // For now, let's fetch any admin user to act as creator
      const usersRes = await fetch('/api/users');
      const users = await usersRes.json();
      const admin = users.find((u: any) => u.role.name === 'super_admin' || u.role.name === 'admin');
      
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: formData.assignmentId,
          sessionDate,
          mode: formData.mode,
          location: formData.location,
          topic: formData.topic,
          createdById: admin?.id || users[0]?.id
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to schedule session');
      }

      alert('Session scheduled successfully!');
      router.push('/sessions');
    } catch (err) {
      console.error('Error scheduling session:', err);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Schedule a Session</h1>

      <div className="bg-white rounded-lg shadow p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Mentor-Student Assignment Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mentor-Student Assignment *</label>
            <select 
              name="assignmentId"
              value={formData.assignmentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an Assignment</option>
              {assignments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.mentor} → {a.student} ({a.department})
                </option>
              ))}
            </select>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mode and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mode *</label>
              <select 
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IN_PERSON">In-Person</option>
                <option value="ONLINE">Virtual</option>
                <option value="PHONE">Phone</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Location / Meeting Link
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Room 101 or Meeting Link"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Topic / Agenda */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Topic / Agenda *</label>
            <textarea
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Describe the session topic..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {submitting ? 'Scheduling...' : 'Schedule Session'}
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
