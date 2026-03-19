import { getCurrentUser, Role, RoleNames } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboardPage from "./admin/page";
import DepartmentDashboardPage from "./department/page";
import MentorDashboardPage from "./mentor/page";
import StudentDashboardPage from "./student/page";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  AlertTriangle, 
  LayoutDashboard,
  Target,
  MessageSquare
} from "lucide-react";

export const metadata = {
  title: "Dashboard Overview - SMMS",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const roleName = RoleNames[user.roleId] || "User";
  
  // Fetch common stats based on role
  let stats = {
    students: 0,
    mentors: 0,
    sessions: 0,
    alerts: 0
  };

  if (user.roleId === Role.SUPER_ADMIN || user.roleId === Role.INSTITUTIONAL_ADMIN) {
    const [sCount, mCount, sesCount, aCount] = await Promise.all([
      prisma.user.count({ where: { roleId: Role.STUDENT } }),
      prisma.user.count({ where: { roleId: Role.MENTOR } }),
      prisma.sessionRecord.count(),
      prisma.alert.count({ where: { status: "OPEN" } })
    ]);
    stats = { students: sCount, mentors: mCount, sessions: sesCount, alerts: aCount };
  } else if (user.roleId === Role.MENTOR) {
    const [sCount, sesCount, aCount] = await Promise.all([
      prisma.mentorAssignment.count({ where: { mentorId: user.id, status: "ACTIVE" } }),
      prisma.sessionRecord.count({ where: { assignment: { mentorId: user.id } } }),
      prisma.alert.count({ where: { student: { studentAssignments: { some: { mentorId: user.id } } }, status: "OPEN" } })
    ]);
    stats = { students: sCount, mentors: 1, sessions: sesCount, alerts: aCount };
  } else if (user.roleId === Role.STUDENT) {
    const [sesCount, aCount, gCount] = await Promise.all([
      prisma.sessionRecord.count({ where: { assignment: { studentId: user.id } } }),
      prisma.alert.count({ where: { studentId: user.id, status: "OPEN" } }),
      prisma.goal.count({ where: { studentId: user.id, status: "IN_PROGRESS" } })
    ]);
    stats = { students: 1, mentors: 1, sessions: sesCount, alerts: aCount, goals: gCount } as any;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening in your {roleName.toLowerCase()} account.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-indigo-900 line-clamp-1">{user.email}</div>
            <div className="text-xs font-medium text-indigo-600 uppercase tracking-wider">{roleName}</div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label={user.roleId === Role.STUDENT ? "My Goals" : "Total Students"} 
          value={user.roleId === Role.STUDENT ? (stats as any).goals || stats.students : stats.students} 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          color="blue"
        />
        <StatCard 
          label={user.roleId === Role.STUDENT ? "My Mentor" : "Total Mentors"} 
          value={user.roleId === Role.STUDENT ? "Assigned" : stats.mentors} 
          icon={<UserCheck className="w-6 h-6 text-indigo-600" />} 
          color="indigo"
        />
        <StatCard 
          label="Total Sessions" 
          value={stats.sessions} 
          icon={<Calendar className="w-6 h-6 text-emerald-600" />} 
          color="emerald"
        />
        <StatCard 
          label="Active Alerts" 
          value={stats.alerts} 
          icon={<AlertTriangle className="w-6 h-6 text-rose-600" />} 
          color="rose"
          urgent={stats.alerts > 0}
        />
      </div>

      {/* Role-Specific Content */}
      <div className="pt-4">
        {user.roleId === Role.SUPER_ADMIN || user.roleId === Role.INSTITUTIONAL_ADMIN ? (
          <AdminDashboardPage />
        ) : user.roleId === Role.DEPARTMENT_ADMIN ? (
          <DepartmentDashboardPage />
        ) : user.roleId === Role.MENTOR ? (
          <MentorDashboardPage />
        ) : (
          <StudentDashboardPage />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, urgent = false }: { label: string, value: string | number, icon: React.ReactNode, color: string, urgent?: boolean }) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className={`p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
          <p className={`text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300 ${urgent ? 'text-rose-600' : ''}`}>
            {value}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]} group-hover:rotate-6 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
