"use client";
import { useSession } from "next-auth/react";
import useExpenses from "@/hooks/useExpenses";
import AskToLoginPage from "./AskToLoginPage";
export default function AccountGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const { isDemo, ready } = useExpenses();
  if (!ready || (!isDemo && status === "loading"))
    return <div className="skeleton h-80" aria-label="Loading your account" />;
  return isDemo || status === "authenticated" ? children : <AskToLoginPage />;
}
