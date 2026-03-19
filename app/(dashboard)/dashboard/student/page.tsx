import { User, Calendar, Target, MessageSquare } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Mentor Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">My Mentor</h2>
              <p className="text-sm text-gray-500">Your primary guide and point of contact</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-500 text-sm italic">Loading mentor details...</p>
          </div>
        </div>

        {/* Upcoming Meetings Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Meeting History</h2>
              <p className="text-sm text-gray-500">Track your past and scheduled sessions</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-500 text-sm">No recent history found.</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goals Progress Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">My Goals</h2>
              <p className="text-sm text-gray-500">Current progress on your academic goals</p>
            </div>
          </div>
          <div className="space-y-4">
             <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-1/3 rounded-full"></div>
             </div>
             <p className="text-xs text-gray-500 text-right font-medium">1 / 3 Goals completed</p>
          </div>
        </div>

        {/* Feedback Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Feedback Received</h2>
              <p className="text-sm text-gray-500">Recent suggestions from your mentor</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
             <p className="text-gray-500 text-sm">Waiting for your first feedback.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
