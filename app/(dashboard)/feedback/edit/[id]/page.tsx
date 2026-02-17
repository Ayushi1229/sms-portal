'use client';

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export default function EditFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    rating: 5,
    comments: '',
    visibility: 'STUDENT',
  });

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/feedback/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          rating: data.rating,
          comments: data.comments || '',
          visibility: data.visibility,
        });
      } else {
        setError("Feedback not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update feedback');
      }

      router.push('/feedback');
    } catch (err) {
      console.error('Error updating feedback:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Feedback</h1>
      
      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-800 rounded-lg">{error}</div>}

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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comments *</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Feedback'}
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
