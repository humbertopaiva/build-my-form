import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
      </div>
    </div>
  );
}
