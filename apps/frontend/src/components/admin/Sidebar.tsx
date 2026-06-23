"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, FileText, MessageSquare, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Site Content", href: "/admin/content", icon: ImageIcon },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Comments", href: "/admin/comments", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-[#0a0a0a] flex flex-col hidden md:flex sticky top-0 z-50">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Logo textSize="text-2xl" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? "bg-white/5 text-primary" 
                  : "text-text-muted hover:text-white hover:bg-white/5"
                }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
              )}
              
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium tracking-wide text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Area / Bottom */}
      <div className="p-4 border-t border-white/5">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-red-400 hover:bg-white/5 transition-all duration-300 group cursor-pointer">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium tracking-wide text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
