'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadFilePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [relatedType, setRelatedType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select a file.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (relatedType) formData.append('relatedType', relatedType);

      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(body.error || 'Upload failed');
      }

      router.push('/files');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload File</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={submit} className="space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
            <p className="text-xs text-gray-500 mt-2">Allowed: images, PDF, text files. Max size: 10MB.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Related Type (optional)</label>
            <select
              value={relatedType}
              onChange={(e) => setRelatedType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">None</option>
              <option value="SESSION">Session</option>
              <option value="FEEDBACK">Feedback</option>
              <option value="GOAL">Goal</option>
              <option value="ASSIGNMENT">Assignment</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Uploading...' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/files')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
