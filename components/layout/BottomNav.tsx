"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, MapPin, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "Create Link", icon: PlusCircle },
  { href: "/tracking", label: "Track Order", icon: MapPin },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
