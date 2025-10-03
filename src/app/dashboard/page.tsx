import ExpenseChart from "@/components/ExpenseChart";
import {auth} from "@/auth"
import type {Session} from "next-auth";
import LatestTransaction from "@/components/LatestTransactions";
import AccountSummary from "@/components/AccountSummary";
import AskToLoginPage from "@/components/AskToLoginPage";

export default async function DashboardPage() {
  const session: Session | null = await auth();
  if (!session) {
    return <AskToLoginPage />
  }

  const user = session.user
  return (
    <main className="w-full">
      <h1 className="text-xl font-semibold">Dobry wieczór, {user?.name}</h1>

      <div className="mt-6 flex flex-col gap-4">
        {/* Sekcja konta */}
        <AccountSummary/>

        {/* Wykres */}
        <ExpenseChart/>

        {/* Ostatnie transakcje */}
        <LatestTransaction/>

      </div>
    </main>
  );
}
