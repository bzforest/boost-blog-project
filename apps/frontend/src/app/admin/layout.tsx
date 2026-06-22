import { AdminShell } from "@/components/admin/AdminShell";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata = {
  title: "Admin Dashboard - Boost Blog",
  description: "Boost Blog Administration Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-text-main flex selection:bg-primary/30">
        <AdminShell>
          {children}
        </AdminShell>
      </div>
    </AuthProvider>
  );
}
