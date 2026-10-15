import React from "react";
import BottomNav from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils/ui";
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full" | "auto";
}
export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("app-shell", className)}>
      <BottomNav />
      <div className="workspace">
        <header className="workspace-topbar">
          <span>Personal finance</span>
          <span className="topbar-note">
            <span />A little clarity. Every day.
          </span>
        </header>
        <div className="page-content">{children}</div>
        <footer className="workspace-footer">
          <span>moneytracker.</span>
          <span>Make room for financial clarity.</span>
        </footer>
      </div>
    </div>
  );
}
