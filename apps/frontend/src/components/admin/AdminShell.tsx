"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { UserCircle, Menu, X, LayoutDashboard, ImageIcon, FileText, MessageSquare, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { motion, AnimatePresence } from "framer-motion";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Site Content", href: "/admin/content", icon: ImageIcon },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
  ];

  return (
    <>
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen relative min-w-0 w-full">
        {/* Topbar */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button 
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium text-white/80 tracking-wide hidden sm:block">Admin Workspace</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mobile Admin Workspace */}
            <h1 className="text-sm font-medium text-primary tracking-wider sm:hidden uppercase">Admin Workspace</h1>

            <div className="flex items-center gap-3 px-3 md:px-4 py-2 rounded-full bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors hidden md:flex">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <UserCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium tracking-wide truncate max-w-[150px]">
                {session?.user?.email || "Administrator"}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-white/5 z-[100] flex flex-col md:hidden"
              >
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                  <Logo textSize="text-2xl" />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-text-muted hover:text-white bg-white/5 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Admin Profile */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs text-text-muted">Logged in as</span>
                      <span className="text-sm font-medium text-white truncate">
                        {session?.user?.email || "Administrator"}
                      </span>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                          ${isActive 
                            ? "bg-white/5 text-primary" 
                            : "text-text-muted hover:text-white hover:bg-white/5"
                          }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                        )}
                        <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                        <span className="font-medium tracking-wide text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-white/5">
                  <button 
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-red-400 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium tracking-wide text-sm">Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </>
  );
}
