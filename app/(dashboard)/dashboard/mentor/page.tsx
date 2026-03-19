import { Users, Calendar, AlertTriangle } from "lucide-react";

export default function MentorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">My Mentees</h2>
              <p className="text-sm text-gray-500">Quick access to your assigned students</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
             <p className="text-gray-500 text-sm">No mentees assigned yet.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Upcoming Meetings</h2>
              <p className="text-sm text-gray-500">Scheduled sessions for this week</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
             <p className="text-gray-500 text-sm">No meetings scheduled.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Academic Alerts</h2>
            <p className="text-sm text-gray-500">Priority cases requiring your attention</p>
          </div>
        </div>
        <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
           <p className="text-gray-500 text-sm">All mentees are performing well. No alerts detected.</p>
        </div>
      </div>
    </div>
  );
}
