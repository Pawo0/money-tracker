"use client";
import useExpenses from "@/hooks/useExpenses";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  LogOut,
  LogIn,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils/ui";
const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/history", label: "Transactions", icon: ArrowLeftRight },
  { href: "/add", label: "Add expense", icon: Plus },
];
export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDemo, exitDemo } = useExpenses();
  const { data: session } = useSession();
  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        <span className="brand-mark">
          <ChartNoAxesCombined size={21} />
        </span>
        money<span className="brand-light">tracker</span>
        <span className="brand-dot">.</span>
      </Link>
      <div className="space-switch">
        <span className="space-icon">
          <Wallet size={17} />
        </span>
        <span>
          {isDemo ? "Demo workspace" : "My finances"}
          <small>
            {isDemo ? "Explore with sample data" : "Personal workspace"}
          </small>
        </span>
        <ChevronDown size={14} />
      </div>
      <span className="nav-caption">WORKSPACE</span>
      <nav aria-label="Main navigation">
        <ul>
          {items.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={
                  pathname === href ||
                  (href === "/dashboard" && pathname === "/") ||
                  (href === "/history" && pathname.startsWith("/history/"))
                    ? "page"
                    : undefined
                }
                className={cn(
                  "nav-link",
                  (pathname === href ||
                    (href === "/dashboard" && pathname === "/") ||
                    (href === "/history" &&
                      pathname.startsWith("/history/"))) &&
                    "active",
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
                {href === "/add" && <span className="nav-plus">+</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="note-icon">
            <ChartNoAxesCombined size={18} />
          </span>
          <p>
            A little more awareness.
            <br />
            <strong>A little less overspending.</strong>
          </p>
          <Link href="/add">
            Log today’s expense <ArrowUpRight size={14} />
          </Link>
        </div>
        <button
          className="profile"
          onClick={() => {
            if (isDemo) {
              if (exitDemo()) router.push("/");
            } else if (session) signOut();
            else signIn("google");
          }}
        >
          <span className="avatar">
            {isDemo ? "A" : session?.user?.name?.charAt(0) || "G"}
          </span>
          <span>
            {isDemo ? "Alex Morgan" : session?.user?.name || "Guest"}
            <small>
              {isDemo
                ? "Demo account · Exit demo"
                : session
                  ? "Personal account"
                  : "Sign in with Google"}
            </small>
          </span>
          {session || isDemo ? <LogOut size={16} /> : <LogIn size={16} />}
        </button>
      </div>
    </aside>
  );
}
