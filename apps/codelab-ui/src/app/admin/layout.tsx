"use client";

import { useAdminAuth } from "@/components/admin/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Activity,
  LayoutDashboard,
  Menu,
  Monitor,
  Settings,
  User,
  Users,
} from "lucide-react"; // Import Menu and icon components
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { adminPaths, home } from "../../paths";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAdminAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: adminPaths.dashboard(),
      icon: LayoutDashboard,
    },
    {
      name: "All sessions",
      href: adminPaths.sessions(),
      icon: Monitor,
    },
    {
      name: "Language Images",
      href: adminPaths.runtimes(),
      icon: Monitor,
    },
    {
      name: "System Monitor",
      href: adminPaths.systemMonitor(),
      icon: Activity,
    },
    {
      name: "All students",
      href: adminPaths.students(),
      icon: Users,
    },
    {
      name: "Profile",
      href: adminPaths.profile(),
      icon: User,
    },
    {
      name: "Settings",
      href: adminPaths.settings(),
      icon: Settings,
    },
  ];

  if (!user) {
    router.replace(home());
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </button>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
      />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
