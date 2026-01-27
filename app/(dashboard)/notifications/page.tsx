import type { Metadata } from "next";
import { Bell, Archive, CheckCircle, AlertCircle, Info, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Notifications - SMMS",
};

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "session",
      title: "Upcoming Session Reminder",
      message: "Your session with John Doe is in 2 hours (2:00 PM)",
      timestamp: "5 minutes ago",
      read: false,
      icon: Bell,
    },
    {
      id: 2,
      type: "feedback",
      title: "New Feedback Received",
      message: "Jane Smith has submitted feedback for your mentoring session",
      timestamp: "1 hour ago",
      read: false,
      icon: AlertCircle,
    },
    {
      id: 3,
      type: "goal",
      title: "Goal Progress Update",
      message: "Mike Johnson has completed 75% of his Q1 goals",
      timestamp: "3 hours ago",
      read: true,
      icon: CheckCircle,
    },
    {
      id: 4,
      type: "alert",
      title: "At-Risk Student Alert",
      message: "Emily Davis shows signs of academic struggle. Immediate intervention recommended.",
      timestamp: "1 day ago",
      read: true,
      icon: AlertCircle,
    },
    {
      id: 5,
      type: "system",
      title: "System Maintenance Scheduled",
      message: "The system will be under maintenance on Saturday 2024-01-20 from 2:00 AM to 4:00 AM",
      timestamp: "2 days ago",
      read: true,
      icon: Info,
    },
    {
      id: 6,
      type: "assignment",
      title: "New Assignment",
      message: "You have been assigned as mentor for 3 new students",
      timestamp: "3 days ago",
      read: true,
      icon: AlertCircle,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">You have {unreadCount} unread notification(s)</p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold flex items-center gap-2">
            <Archive size={18} />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notification Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold">All</button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold">Unread</button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold">Sessions</button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold">Alerts</button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition cursor-pointer ${
                notification.read
                  ? "bg-white border-gray-200 hover:border-gray-300"
                  : "bg-blue-50 border-blue-200 hover:border-blue-300"
              }`}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  notification.type === "alert"
                    ? "bg-red-100 text-red-600"
                    : notification.type === "feedback"
                    ? "bg-green-100 text-green-600"
                    : notification.type === "session"
                    ? "bg-blue-100 text-blue-600"
                    : notification.type === "system"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  <Icon size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 ml-4 mt-1"></div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition">
                      <CheckCircle size={20} />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-red-600 transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:underline font-semibold">Load more notifications →</button>
      </div>
    </div>
  );
}
