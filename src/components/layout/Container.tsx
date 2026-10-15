import DemoBanner from "@/components/features/auth/DemoBanner";
import React from "react";
import BottomNav from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils/ui";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full" | "auto";
}) {
  return (
    <div className="app-shell">
      <BottomNav />
      <div className={cn("workspace", className)}>
        <header className="workspace-bar">
          <span>
            Personal workspace <span className="bar-slash">/</span> Finances
          </span>
          <span className="workspace-status">
            <i /> A little more clarity
          </span>
        </header>
        <div className="page-content">
          <DemoBanner />
          {children}
        </div>
        <footer className="workspace-footer">
          <span>Money Tracker</span>
          <span>Small habits. More control.</span>
        </footer>
      </div>
    </div>
  );
}
