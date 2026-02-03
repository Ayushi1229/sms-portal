"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    section: "Dashboard",
    items: [
      { href: "/dashboard", label: "Overview", icon: "📊" },
    ],
  },
  {
    section: "User Management",
    items: [
      { href: "/users", label: "All Users", icon: "👥" },
      { href: "/mentors", label: "Mentors", icon: "👨‍🏫" },
      { href: "/students", label: "Students", icon: "👨‍🎓" },
      { href: "/assignments", label: "Assignments", icon: "🔗" },
      { href: "/roles", label: "Roles & Permissions", icon: "🔐" },
    ],
  },
  {
    section: "Mentoring",
    items: [
      { href: "/sessions", label: "Sessions", icon: "📅" },
      { href: "/sessions/schedule", label: "Schedule Session", icon: "➕" },
      { href: "/sessions/history", label: "Session History", icon: "📜" },
      { href: "/feedback", label: "Feedback", icon: "💬" },
      { href: "/goals", label: "Goals", icon: "🎯" },
    ],
  },
  {
    section: "Monitoring",
    items: [
      { href: "/alerts", label: "Alerts", icon: "⚠️" },
      { href: "/notifications", label: "Notifications", icon: "🔔" },
    ],
  },
  {
    section: "Reports",
    items: [
      { href: "/reports", label: "Reports Dashboard", icon: "📈" },
      { href: "/reports/mentor-load", label: "Mentor Load", icon: "📊" },
      { href: "/reports/student-progress", label: "Student Progress", icon: "📉" },
      { href: "/reports/department-summary", label: "Department Summary", icon: "🏢" },
    ],
  },
  {
    section: "System",
    items: [
      { href: "/departments", label: "Departments", icon: "🏫" },
      { href: "/audit", label: "Audit Logs", icon: "📋" },
      { href: "/settings/profile", label: "Settings", icon: "⚙️" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="mb-6 p-3 bg-white rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-700">Logged in as</div>
          <div className="text-lg font-bold text-indigo-600">Admin</div>
          <div className="text-xs text-gray-500">admin@sampleinstitute.edu</div>
        </div>

        <nav className="space-y-6">
          {menuItems.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
