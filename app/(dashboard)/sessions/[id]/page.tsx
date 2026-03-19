'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

interface SessionDetail {
  id: string;
  topic: string;
  sessionDate: string;
  mode: string;
  location: string;
  status: string;
  summary: string | null;
  assignment: {
    student: {
      id: string;
      email: string;
      profile: {
        firstName: string;
        lastName: string;
      } | null;
    };
    mentor: {
      id: string;
      email: string;
      profile: {
        firstName: string;
        lastName: string;
      } | null;
    };
  };
}

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sessions/${id}`);
      if (!response.ok) {
        throw new Error('Session not found');
      }
      const data = await response.json();
      setSession(data);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
        <p className="text-red-700 mb-6">{error || 'Session not found'}</p>
        <button 
          onClick={() => router.back()}
          className="bg-white text-red-700 border border-red-200 px-6 py-2 rounded-xl hover:bg-red-100 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { assignment } = session;
  const studentName = `${assignment.student.profile?.firstName || ''} ${assignment.student.profile?.lastName || ''}`.trim() || assignment.student.email;
  const mentorName = `${assignment.mentor.profile?.firstName || ''} ${assignment.mentor.profile?.lastName || ''}`.trim() || assignment.mentor.email;
  const sessionDate = new Date(session.sessionDate);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SCHEDULED": return "bg-blue-100 text-blue-700";
      case "COMPLETED": return "bg-emerald-100 text-emerald-700";
      case "CANCELLED": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-200 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Sessions</span>
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                {session.mode} Session
              </span>
              <h1 className="text-3xl font-extrabold">{session.topic}</h1>
              <div className="flex flex-wrap items-center gap-6 opacity-90 text-sm mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {sessionDate.toLocaleDateString('en-US', { dateStyle: 'full' })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {sessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {session.location || 'Online'}
                </div>
              </div>
            </div>
            <div className={`px-6 py-2 rounded-2xl font-bold bg-white text-indigo-600`}>
              {session.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Participants */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Participants
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {mentorName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Mentor</div>
                  <div className="font-bold text-gray-900">{mentorName}</div>
                  <div className="text-xs text-gray-500">{assignment.mentor.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  {studentName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Student</div>
                  <div className="font-bold text-gray-900">{studentName}</div>
                  <div className="text-xs text-gray-500">{assignment.student.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="p-8 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Summary & Notes
            </h2>
            
            <div className="prose prose-sm text-gray-600 max-w-none">
              {session.summary ? (
                <p>{session.summary}</p>
              ) : (
                <div className="p-12 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-200">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-400">No session notes or summary available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
