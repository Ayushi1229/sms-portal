'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MessageSquare, 
  User, 
  Calendar, 
  ArrowLeft,
  Star,
  Quote,
  XCircle,
  Shield,
  Download
} from "lucide-react";
import Link from "next/link";

interface FeedbackDetail {
  id: string;
  rating: number;
  comments: string | null;
  type: string;
  visibility: string;
  createdAt: string;
  session: {
    id: string;
    topic: string;
    sessionDate: string;
  };
  giver: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  };
  recipient: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  };
}

export default function FeedbackDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/feedback/${id}`);
      if (!response.ok) {
        throw new Error('Feedback not found');
      }
      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
        <p className="text-red-700 mb-6">{error || 'Feedback not found'}</p>
        <button 
          onClick={() => router.back()}
          className="bg-white text-red-700 border border-red-200 px-6 py-2 rounded-xl hover:bg-red-100 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const giverName = `${feedback.giver.profile?.firstName || ''} ${feedback.giver.profile?.lastName || ''}`.trim() || feedback.giver.email;
  const recipientName = `${feedback.recipient.profile?.firstName || ''} ${feedback.recipient.profile?.lastName || ''}`.trim() || feedback.recipient.email;
  const createdAt = new Date(feedback.createdAt);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-200 group-hover:border-rose-100 group-hover:bg-rose-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Feedback</span>
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
            <Download className="w-4 h-4" />
            Export as PDF
          </button>
          <Link href={`/feedback/edit/${feedback.id}`}>
            <button className="bg-rose-600 text-white px-5 py-2.5 rounded-xl hover:bg-rose-700 transition-shadow shadow-sm hover:shadow-md font-medium">
              Update Feedback
            </button>
          </Link>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-rose-600 p-10 text-white text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Quote className="w-48 h-48 rotate-180" />
          </div>
          
          <div className="relative z-10 space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest">
               {feedback.type.replace('_', ' ')}
             </div>
             <h1 className="text-4xl font-black">{feedback.session.topic}</h1>
             <p className="opacity-80 font-medium">Feedback shared on {createdAt.toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
             
             <div className="flex justify-center gap-2 pt-4">
               {[1, 2, 3, 4, 5].map((s) => (
                 <Star 
                   key={s} 
                   className={`w-8 h-8 ${s <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`} 
                 />
               ))}
             </div>
          </div>
        </div>

        <div className="p-10 space-y-12">
          {/* Comments Section */}
          <div className="relative bg-gray-50 rounded-[2rem] p-8 border border-gray-100 italic">
            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-rose-100 fill-rose-100" />
            <div className="relative z-10 text-xl font-medium text-gray-700 leading-relaxed text-center">
              "{feedback.comments || 'No written comments provided.'}"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Parties Involved */}
            <div className="space-y-6">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <User className="w-4 h-4" />
                 People
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-lg">
                      {giverName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Giver</div>
                      <div className="font-bold text-gray-900">{giverName}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                      {recipientName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Recipient</div>
                      <div className="font-bold text-gray-900">{recipientName}</div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Privacy & Visibility */}
            <div className="space-y-6">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <Shield className="w-4 h-4" />
                 Permissions
               </h3>
               <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="text-[10px] font-black text-indigo-400 uppercase mb-1">Visible To</div>
                  <div className="font-bold text-indigo-900">{feedback.visibility.replace('_', ' ')}</div>
                  <p className="text-xs text-indigo-600 mt-2">
                    This feedback adheres to the system's strict confidentiality protocols.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
