"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowUpRight,
  Home,
  Plus,
  List,
  LayoutDashboard,
  Wallet,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils/ui";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/history", label: "Transactions", icon: List },
  { href: "/add", label: "Add expense", icon: Plus },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="Money Tracker — home">
        <span className="brand-icon">
          <Wallet size={21} />
        </span>
        <span>
          money<span className="brand-light">tracker</span>
          <span className="brand-dot">.</span>
        </span>
      </Link>
      <div className="nav-caption">YOUR WORKSPACE</div>
      <nav aria-label="Main navigation">
        <ul className="nav-list">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/history"
                ? pathname.startsWith(href)
                : pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn("nav-link", isActive && "is-active")}
                >
                  <Icon size={19} />
                  <span>{label}</span>
                  {isActive && <span className="nav-dot" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="small-label">SMALL HABITS, REAL CHANGE</span>
          <p>
            Little expenses.
            <br />
            The bigger picture.
          </p>
          <ArrowUpRight size={20} />
        </div>
        <div className="profile">
          <span className="avatar">
            {session?.user?.name?.charAt(0) || "M"}
          </span>
          <div>
            <strong>{session?.user?.name || "Your wallet"}</strong>
            <span>
              {session ? "Personal account" : "Make yourself at home"}
            </span>
          </div>
          {session && (
            <button
              type="button"
              onClick={() => signOut()}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={17} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
