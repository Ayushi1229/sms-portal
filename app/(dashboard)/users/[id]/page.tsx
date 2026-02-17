'use client';

import { useEffect, useState, use } from "react";
import { User, Mail, Shield, Building, Calendar, Phone, Briefcase, GraduationCap, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  status: string;
  role: {
    name: string;
  };
  department: {
    name: string;
  } | null;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    title?: string;
    bio?: string;
  } | null;
  mentorProfile?: {
    designation?: string;
    specialization?: string;
    maxMentees: number;
    availabilityStatus: string;
  };
  studentProfile?: {
    rollNumber: string;
    program?: string;
    yearOfStudy?: number;
    gpa?: number;
    riskLevel: string;
  };
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold mb-4">{error || "User not found"}</p>
        <button 
          onClick={() => router.back()}
          className="text-indigo-600 hover:underline flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const fullName = `${userData.profile?.firstName || ''} ${userData.profile?.lastName || ''}`.trim() || 'No Name';
  const roleName = userData.role.name.replace('_', ' ').toUpperCase();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={20} />
          Back to list
        </button>
        <div className="flex gap-3">
          <Link href={`/users/${id}/edit`}>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info & Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {fullName.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h2>
            <p className="text-indigo-600 font-medium mb-4">{roleName}</p>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              userData.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {userData.status}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Email Address</p>
                  <p className="text-sm text-gray-900 font-medium break-all">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-purple-50 p-2 rounded-lg text-purple-600">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                  <p className="text-sm text-gray-900 font-medium">{userData.profile?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">About & Background</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Building size={14} /> Department
                  </p>
                  <p className="text-gray-900 font-semibold">{userData.department?.name || 'Unassigned'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Briefcase size={14} /> Title / Designation
                  </p>
                  <p className="text-gray-900 font-semibold">{userData.profile?.title || userData.mentorProfile?.designation || 'Not specified'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bio</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {userData.profile?.bio || 'This user hasn\'t added a biography yet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Role Specific Info */}
          {userData.role.name === 'mentor' && userData.mentorProfile && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-indigo-50 px-8 py-4 border-b border-indigo-100 text-indigo-900">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Briefcase size={20} /> Mentor Portfolio
                </h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Specialization</p>
                  <p className="text-gray-900 font-semibold break-words">{userData.mentorProfile.specialization || 'General'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Availability</p>
                  <p className="text-gray-900 font-semibold">{userData.mentorProfile.availabilityStatus}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Mentee Capacity</p>
                  <p className="text-gray-900 font-semibold">{userData.mentorProfile.maxMentees} Students</p>
                </div>
              </div>
            </div>
          )}

          {userData.role.name === 'student' && userData.studentProfile && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-green-50 px-8 py-4 border-b border-green-100 text-green-900">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <GraduationCap size={20} /> Academic Record
                </h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Roll/ID Number</p>
                  <p className="text-gray-900 font-bold text-lg">{userData.studentProfile.rollNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Program / Course</p>
                  <p className="text-gray-900 font-semibold">{userData.studentProfile.program || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Year of Study</p>
                  <p className="text-gray-900 font-semibold">{userData.studentProfile.yearOfStudy ? `Year ${userData.studentProfile.yearOfStudy}` : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Current GPA</p>
                  <p className="text-gray-900 font-bold text-xl">{userData.studentProfile.gpa || '0.00'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Risk Level</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    userData.studentProfile.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                    userData.studentProfile.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {userData.studentProfile.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
