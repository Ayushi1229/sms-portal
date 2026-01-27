import type { Metadata } from "next";
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Session Calendar - SMMS",
};

export default function SessionCalendarPage() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const upcomingSessions = [
    {
      id: 1,
      date: 15,
      mentor: "Dr. Sarah Johnson",
      student: "John Doe",
      time: "2:00 PM",
      mode: "In-Person",
      topic: "Database Design",
    },
    {
      id: 2,
      date: 18,
      mentor: "Dr. Ahmed Hassan",
      student: "Jane Smith",
      time: "3:30 PM",
      mode: "Virtual",
      topic: "Web Development",
    },
    {
      id: 3,
      date: 22,
      mentor: "Prof. Michael Chen",
      student: "Mike Johnson",
      time: "1:00 PM",
      mode: "In-Person",
      topic: "Data Structures",
    },
    {
      id: 4,
      date: 25,
      mentor: "Dr. Sarah Johnson",
      student: "Emily Davis",
      time: "4:00 PM",
      mode: "Virtual",
      topic: "Project Review",
    },
  ];

  const sessionsOnDate = (date: number) => 
    upcomingSessions.filter(s => s.date === date).length > 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Session Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">January 2024</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={`empty-${i}`} className="bg-gray-50 rounded-lg p-4 h-24"></div>
            ))}
            
            {monthDays.map((date) => (
              <div
                key={date}
                className={`border rounded-lg p-3 h-24 cursor-pointer transition ${
                  sessionsOnDate(date)
                    ? "border-blue-400 bg-blue-50 hover:bg-blue-100"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <p className={`text-sm font-semibold ${
                  sessionsOnDate(date) ? "text-blue-600" : "text-gray-900"
                }`}>
                  {date}
                </p>
                {sessionsOnDate(date) && (
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <p className="text-xs text-blue-600 mt-1 font-semibold">
                      {upcomingSessions.filter(s => s.date === date).length} session(s)
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-900 text-sm">
                    Jan {session.date}
                  </p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    session.mode === "Virtual"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {session.mode}
                  </span>
                </div>
                
                <p className="text-xs font-semibold text-blue-600 mb-2">{session.topic}</p>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span className="truncate">{session.mentor}</span>
                  </div>
                </div>

                <button className="mt-2 w-full text-blue-600 hover:underline text-xs font-semibold">
                  View →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
