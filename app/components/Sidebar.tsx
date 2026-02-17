"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAllowedNavigation, RoleNames, Role } from "@/lib/auth/permissions";

// Define menu structure with role-based access
const getMenuStructure = (roleId: number) => {
  const navigation = getAllowedNavigation(roleId);
  
  // Organize navigation items into sections based on role
  const menuItems: Array<{ section: string; items: Array<{ href: string; label: string; icon: string }> }> = [];

  // Dashboard section (all roles)
  menuItems.push({
    section: "Dashboard",
    items: [
      { href: "/dashboard", label: "Overview", icon: "📊" },
    ],
  });

  // Admin sections
  if (roleId === Role.SUPER_ADMIN || roleId === Role.INSTITUTIONAL_ADMIN) {
    menuItems.push({
      section: "Administration",
      items: [
        { href: "/users", label: "Users", icon: "👥" },
        ...(roleId === Role.SUPER_ADMIN ? [
          { href: "/institutions", label: "Institutions", icon: "🏛️" },
          { href: "/roles", label: "Roles", icon: "🔐" },
        ] : []),
        { href: "/departments", label: "Departments", icon: "🏫" },
      ],
    });
  }

  // User Management
  if (roleId === Role.SUPER_ADMIN || roleId === Role.INSTITUTIONAL_ADMIN || roleId === Role.DEPARTMENT_ADMIN) {
    menuItems.push({
      section: "User Management",
      items: [
        { href: "/mentors", label: "Mentors", icon: "👨‍🏫" },
        { href: "/students", label: "Students", icon: "👨‍🎓" },
        { href: "/assignments", label: "Assignments", icon: "🔗" },
      ],
    });
  } else if (roleId === Role.MENTOR) {
    menuItems.push({
      section: "My Mentees",
      items: [
        { href: "/students", label: "My Students", icon: "👨‍🎓" },
        { href: "/assignments", label: "My Assignments", icon: "🔗" },
      ],
    });
  } else if (roleId === Role.STUDENT) {
    menuItems.push({
      section: "My Mentoring",
      items: [
        { href: "/mentors", label: "My Mentor", icon: "👨‍🏫" },
      ],
    });
  }

  // Mentoring Activities
  menuItems.push({
    section: "Mentoring",
    items: [
      { href: "/sessions", label: "Sessions", icon: "📅" },
      { href: "/goals", label: "Goals", icon: "🎯" },
      { href: "/feedback", label: "Feedback", icon: "💬" },
    ],
  });

  // Monitoring
  menuItems.push({
    section: "Monitoring",
    items: [
      { href: "/alerts", label: "Alerts", icon: "⚠️" },
      { href: "/notifications", label: "Notifications", icon: "🔔" },
    ],
  });

  // Reports (admins only)
  if (roleId === Role.SUPER_ADMIN || roleId === Role.INSTITUTIONAL_ADMIN || roleId === Role.DEPARTMENT_ADMIN) {
    menuItems.push({
      section: "Reports",
      items: [
        { href: "/reports", label: "Reports Dashboard", icon: "📈" },
        { href: "/audit", label: "Audit Logs", icon: "📋" },
      ],
    });
  }

  // Settings (all roles)
  menuItems.push({
    section: "System",
    items: [
      { href: "/settings", label: "Settings", icon: "⚙️" },
    ],
  });

  return menuItems;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
        <div className="p-4">
          <div className="mb-6 p-3 bg-white rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </aside>
    );
  }

  const menuItems = user ? getMenuStructure(user.roleId) : [];
  const userRoleName = user ? RoleNames[user.roleId] || "User" : "Guest";
  const userName = user?.profile 
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email || "Guest";

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="mb-6 p-3 bg-white rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-700">Logged in as</div>
          <div className="text-lg font-bold text-indigo-600">{userName}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
          <div className="mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
            {userRoleName}
          </div>
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
