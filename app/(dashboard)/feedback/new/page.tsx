'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

interface Session {
  id: string;
  mentor: string;
  student: string;
  date: string;
  topic: string;
}

export default function NewFeedbackPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sessionId: '',
    rating: 5,
    comments: '',
    type: 'MENTOR_TO_STUDENT',
    visibility: 'STUDENT',
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        setSessions(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Find the session to get user IDs
      const sessionRes = await fetch(`/api/sessions`); // Usually we'd get full details
      // For simplicity in this demo, we'll fetch all session details from the session itself
      // In a real app, we'd probably have deeper API endpoints
      
      const currentSession = sessions.find(s => s.id === formData.sessionId);
      if (!currentSession) throw new Error("Session not found");

      // We need user IDs. Let's fetch the detailed session from API
      const detailRes = await fetch(`/api/feedback/session-users?sessionId=${formData.sessionId}`);
      const ids = await detailRes.json();

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          giverUserId: formData.type === 'MENTOR_TO_STUDENT' ? ids.mentorId : ids.studentId,
          recipientUserId: formData.type === 'MENTOR_TO_STUDENT' ? ids.studentId : ids.mentorId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create feedback');
      }

      router.push('/feedback');
    } catch (err) {
      console.error('Error creating feedback:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading sessions...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Give Feedback</h1>
      
      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-800 rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Session *</label>
            <select
              value={formData.sessionId}
              onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Choose a session</option>
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.date} - {s.topic} ({s.mentor}/{s.student})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Feedback From</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="MENTOR_TO_STUDENT">Mentor to Student</option>
                <option value="STUDENT_TO_MENTOR">Student to Mentor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`p-1 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star fill={formData.rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comments *</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Provide detailed feedback..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
