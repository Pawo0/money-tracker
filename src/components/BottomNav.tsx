"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Home, PlusCircle, List, LayoutDashboard} from "lucide-react";
import {cn} from "@/lib/utils";

const navItems = [
  {href: "/", label: "Home", icon: Home},
  {href: "/dashboard", label: "Dashboard", icon: LayoutDashboard},
  {href: "/history", label: "History", icon: List},
  {href: "/add", label: "Add", icon: PlusCircle},
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className={"sticky bottom-0 left-0 right-0 bg-gray-800 h-full mt-5 -mx-4 sm:-mx-6 lg:-mx-8"}>
      <nav className="border-t bg-gray-700 rounded-b-2xl">
        <ul className="flex justify-around items-center h-16">
          {navItems.map(({href, label, icon: Icon}) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center text-sm text-gray-200 cursor-pointer px-3 py-1.5 ",
                    isActive && "font-semibold bg-gray-500 rounded-lg"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1"/>
                  <span className="hidden sm:block">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
