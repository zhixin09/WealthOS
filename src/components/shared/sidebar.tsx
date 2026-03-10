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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

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

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
                collapsed ? "w-[68px]" : "w-[240px]"
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-border px-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-tight">
                            WealthOS
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                            Wellness Hub
                        </span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const linkClassName = cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    );
                    const linkContent = (
                        <>
                            <item.icon
                                className={cn(
                                    "h-4.5 w-4.5 shrink-0",
                                    isActive ? "text-primary" : ""
                                )}
                            />
                            {!collapsed && <span>{item.label}</span>}
                        </>
                    );

                    if (collapsed) {
                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger
                                    render={
                                        <Link
                                            href={item.href}
                                            className={linkClassName}
                                        />
                                    }
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
                        <Link
                            key={item.href}
                            href={item.href}
                            className={linkClassName}
                        >
                            {linkContent}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-3">
                {!collapsed && (
                    <div className="mb-3 flex items-center gap-3 rounded-lg bg-accent/50 px-3 py-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                            AC
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium">Alex Chen</span>
                            <span className="text-[10px] text-muted-foreground">
                                Moderate Risk
                            </span>
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </aside>
    );
}
