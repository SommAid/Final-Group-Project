"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Upload, ShoppingCart, UserX, LogOut } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuthenticator } from "@aws-amplify/ui-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthenticator((context) => [context.signOut]);

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Data Pull", href: "/data-pull", icon: Search },
    { name: "Load Data", href: "/load-data", icon: Upload },
    { name: "Basket Analysis", href: "/basket-analysis", icon: ShoppingCart },
    { name: "Churn Prediction", href: "/churn-prediction", icon: UserX },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex h-16 items-center border-b px-6 dark:border-zinc-800">
        <h2 className="text-lg font-bold tracking-tight">Retail Analytics</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t dark:border-zinc-800">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
