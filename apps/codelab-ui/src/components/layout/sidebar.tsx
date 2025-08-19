"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChevronUp, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminPaths } from "../../paths";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon; // Use LucideIcon type for icons
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[]; // Add navItems prop
}

export function Sidebar({ isOpen, onClose, navItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[220px] h-screen bg-white border-r border-gray-200 flex flex-col transform transition-transform ease-in-out duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:translate-x-0 md:flex" // Ensure it's static and visible on medium screens and up
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <Link href={adminPaths.dashboard()}>
            <div className="bg-teal-800 text-white rounded-lg h-12 flex items-center justify-center font-semibold text-sm cursor-pointer hover:bg-teal-700 transition-colors">
              LOGO
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full",
                pathname === item.href
                  ? "bg-teal-800 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-amber-500 text-white text-sm font-medium">
                R
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Rhoda Ogunesan
              </p>
              <p className="text-xs text-gray-500 truncate">
                rhodaogunesan@gmail.com
              </p>
            </div>
            <ChevronUp className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
}
