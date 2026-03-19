"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAllowedNavigation, RoleNames, Role } from "@/lib/auth/permissions";

// Define menu structure with role-based access
const getMenuStructure = (roleId: number) => {
  const navigation = getAllowedNavigation(roleId);
  
  // Organize navigation items into sections based on role
  const menuItems: Array<{ section: string; items: Array<{ href: string; label: string }> }> = [];

  // Dashboard section (all roles)
  menuItems.push({
    section: "Dashboard",
    items: [
      { href: "/dashboard", label: "Overview" },
    ],
  });

  // Admin sections
  if (roleId === Role.SUPER_ADMIN || roleId === Role.INSTITUTIONAL_ADMIN) {
    menuItems.push({
      section: "Administration",
      items: [
        { href: "/users", label: "Users" },
        ...(roleId === Role.SUPER_ADMIN ? [
          { href: "/institutions", label: "Institutions" },
          { href: "/roles", label: "Roles" },
        ] : []),
        { href: "/departments", label: "Departments" },
      ],
    });
  }

  // User Management
  if (roleId === Role.SUPER_ADMIN || roleId === Role.INSTITUTIONAL_ADMIN || roleId === Role.DEPARTMENT_ADMIN) {
    menuItems.push({
      section: "User Management",
      items: [
        { href: "/mentors", label: "Mentors" },
        { href: "/students", label: "Students" },
        { href: "/assignments", label: "Assignments" },
      ],
    });
  } else if (roleId === Role.MENTOR) {
    menuItems.push({
      section: "My Mentees",
      items: [
        { href: "/students", label: "My Students" },
        { href: "/assignments", label: "My Assignments" },
      ],
    });
  } else if (roleId === Role.STUDENT) {
    menuItems.push({
      section: "My Mentoring",
      items: [
        { href: "/mentors", label: "My Mentor" },
      ],
    });
  }

  // Mentoring Activities
  menuItems.push({
    section: "Mentoring",
    items: [
      { href: "/sessions", label: "Sessions" },
      { href: "/goals", label: "Goals" },
      { href: "/feedback", label: "Feedback" },
    ],
  });

  // Monitoring
  menuItems.push({
    section: "Monitoring",
    items: [
      { href: "/alerts", label: "Alerts" },
      { href: "/notifications", label: "Notifications" },
    ],
  });

  // Reports (admins only)
  if (roleId === Role.SUPER_ADMIN || roleId === Role.INSTITUTIONAL_ADMIN || roleId === Role.DEPARTMENT_ADMIN) {
    menuItems.push({
      section: "Reports",
      items: [
        { href: "/reports", label: "Reports Dashboard" },
        { href: "/audit", label: "Audit Logs" },
      ],
    });
  }

  // Settings (all roles)
  menuItems.push({
    section: "System",
    items: [
      { href: "/settings", label: "Settings" },
    ],
  });

  return menuItems;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
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
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
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
                        className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
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
