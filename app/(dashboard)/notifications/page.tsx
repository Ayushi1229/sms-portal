"use client";

import { useState } from "react";
import { Bell, Archive, CheckCircle, AlertCircle, Info, Trash2 } from "lucide-react";

const INITIAL_NOTIFICATIONS = [
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    if (filter === "Sessions") return n.type === "session";
    if (filter === "Alerts") return n.type === "alert" || n.type === "system" || n.type === "assignment";
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
          {unreadCount > 0 ? (
            <p className="text-sm font-medium text-blue-600 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              You have {unreadCount} unread notification(s)
            </p>
          ) : (
             <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">
              You are all caught up!
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleMarkAllRead}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all shadow-sm font-semibold flex items-center gap-2"
          >
            <Archive size={18} className="text-gray-500" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notification Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-100/80 p-1.5 rounded-xl w-fit">
        {["All", "Unread", "Sessions", "Alerts"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 font-semibold text-sm rounded-lg transition-all ${
              filter === tab 
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No notifications found in this view.
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 ${
                  notification.read
                    ? "bg-white border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                    : "bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg"
                }`}
              >
                <div className="flex gap-5">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner border ${
                    notification.type === "alert" || notification.type === "assignment"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : notification.type === "feedback"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : notification.type === "session"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : notification.type === "system"
                      ? "bg-purple-50 text-purple-600 border-purple-100"
                      : "bg-yellow-50 text-yellow-600 border-yellow-100"
                  }`}>
                    <Icon size={24} strokeWidth={1.75} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`text-base font-semibold truncate ${notification.read ? "text-gray-800" : "text-gray-900"}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 leading-relaxed ${notification.read ? "text-gray-500" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs font-medium text-gray-400 mt-2.5 tracking-wide uppercase">
                          {notification.timestamp}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-start sm:items-center">
                    {!notification.read && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2.5 bg-white text-gray-400 border border-gray-100 shadow-sm rounded-xl hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                        aria-label="Mark as read"
                      >
                        <CheckCircle size={18} strokeWidth={2} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-2.5 bg-white text-gray-400 border border-gray-100 shadow-sm rounded-xl hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="mt-10 text-center">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Load more notifications
          </button>
        </div>
      )}
    </div>
  );
}
