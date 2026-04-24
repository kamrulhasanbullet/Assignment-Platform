import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
}

export default async function DashboardShell({
  children,
}: DashboardShellProps) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <Navbar />
      </div>
      <div className="flex">
        <Sidebar role={session?.user.role || "STUDENT"} />
        <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
