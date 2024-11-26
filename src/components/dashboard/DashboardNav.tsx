// src/components/dashboard/DashboardNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Settings,
  BarChart3,
  Users,
  Webhook,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    pattern: /^\/dashboard$/,
  },
  {
    label: "Formulários",
    icon: FileText,
    href: "/dashboard/forms",
    pattern: /^\/dashboard\/forms/,
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    pattern: /^\/dashboard\/analytics/,
  },
  {
    label: "Integrações",
    icon: Webhook,
    href: "/dashboard/integrations",
    pattern: /^\/dashboard\/integrations/,
  },
  {
    label: "Usuários",
    icon: Users,
    href: "/dashboard/users",
    pattern: /^\/dashboard\/users/,
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/dashboard/settings",
    pattern: /^\/dashboard\/settings/,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r bg-white space-y-4 py-4 flex flex-col h-screen">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Form Builder
            </h2>
          </div>
          <nav className="space-y-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center py-2 px-3 text-sm font-medium rounded-md",
                  route.pattern.test(pathname)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <route.icon className="mr-3 h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
}
