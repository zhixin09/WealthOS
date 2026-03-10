"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Calculator,
  Bell,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";

import { useClientDirectory } from "@/components/adviser/use-client-directory";
import { getWellnessTone } from "@/components/adviser/presentation";
import { useActiveClient } from "@/components/shared/client-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Research",
    href: "/research",
    icon: Search,
  },
  {
    label: "Planning",
    href: "/planning",
    icon: Calculator,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: Bell,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { activeClientId } = useActiveClient();
  const { clients } = useClientDirectory();
  const activeClient =
    clients.find((client) => client.id === activeClientId) ?? clients[0];
  const tone = getWellnessTone(activeClient?.wellness_score ?? 71);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <TrendingUp className="h-5 w-5" />
        </div>
        {!collapsed ? (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-zinc-100">
              WealthOS
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
              Adviser Terminal
            </span>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const linkClassName = cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "border border-primary/20 bg-primary/10 text-primary"
              : "border border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",
          );
          const linkContent = (
            <>
              <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-primary" : "")} />
              {!collapsed ? <span>{item.label}</span> : null}
            </>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={<Link href={item.href} className={linkClassName} />}
                >
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={linkClassName}>
              {linkContent}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        {!collapsed && activeClient ? (
          <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {getInitials(activeClient.name)}
              </div>
              <div className="min-w-0">
                <span className="block truncate text-xs font-medium text-zinc-100">
                  {activeClient.name}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  {activeClient.risk_profile}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${tone.dot}`} />
                <span className={`text-sm font-semibold font-mono ${tone.text}`}>
                  {activeClient.wellness_score.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-zinc-400 hover:text-zinc-100"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
