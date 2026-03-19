'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Target, 
  User, 
  Calendar, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  History,
  TrendingUp,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface GoalDetail {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  progressPct: number;
  targetDate: string | null;
  student: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  };
  createdBy: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  };
  updates: Array<{
    id: string;
    note: string;
    progressPct: number;
    status: string;
    createdAt: string;
  }>;
}

export default function GoalDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [goal, setGoal] = useState<GoalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoal();
  }, [id]);

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/goals/${id}`);
      if (!response.ok) {
        throw new Error('Goal not found');
      }
      const data = await response.json();
      setGoal(data);
    } catch (err) {
      console.error('Error fetching goal:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
        <p className="text-red-700 mb-6">{error || 'Goal not found'}</p>
        <button 
          onClick={() => router.back()}
          className="bg-white text-red-700 border border-red-200 px-6 py-2 rounded-xl hover:bg-red-100 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const studentName = `${goal.student.profile?.firstName || ''} ${goal.student.profile?.lastName || ''}`.trim() || goal.student.email;
  const creatorName = `${goal.createdBy.profile?.firstName || ''} ${goal.createdBy.profile?.lastName || ''}`.trim() || goal.createdBy.email;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "AT_RISK": return "text-rose-600 bg-rose-50 border-rose-100";
      case "IN_PROGRESS": return "text-blue-600 bg-blue-50 border-blue-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-200 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Goals</span>
        </button>
        <div className="flex gap-3">
          <Link href={`/goals/edit/${goal.id}`}>
            <button className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
              Edit Goal
            </button>
          </Link>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-shadow shadow-sm hover:shadow-md font-medium">
            Update Progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Goal Summary Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                {goal.category}
              </span>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(goal.status)}`}>
                {goal.status.replace('_', ' ')}
              </div>
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{goal.title}</h1>
            <p className="text-gray-600 leading-relaxed mb-8">
              {goal.description || 'No detailed description provided for this goal.'}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-gray-900">Total Progress</span>
                </div>
                <span className="text-2xl font-black text-blue-600">{goal.progressPct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${goal.progressPct}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Progress History
            </h2>
            
            <div className="space-y-6">
              {goal.updates.length > 0 ? (
                goal.updates.map((update, idx) => (
                  <div key={update.id} className="relative pl-8 pb-6 last:pb-0">
                    {idx !== goal.updates.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-100"></div>
                    )}
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-blue-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-400">
                          {new Date(update.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-blue-600">+{update.progressPct}%</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${getStatusColor(update.status)}`}>
                            {update.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{update.note}"</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No activity recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">Student</div>
                  <div className="text-sm font-bold text-gray-900">{studentName}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">Assigned By</div>
                  <div className="text-sm font-bold text-gray-900">{creatorName}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">Target Date</div>
                  <div className="text-sm font-bold text-gray-900">
                    {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Flexible'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {sessionStorage.getItem('userRole') === 'MENTOR' && (
            <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-100">
              <CheckCircle2 className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-bold mb-2">Mentor Actions</h3>
              <p className="text-sm opacity-90 mb-4">You can complete this goal manually if the criteria are met.</p>
              <button className="w-full bg-white text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors">
                Mark as Completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
