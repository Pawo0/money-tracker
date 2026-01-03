import ExpenseChart from "@/components/features/dashboard/ExpenseChart";
import {auth} from "@/auth"
import type {Session} from "next-auth";
import AccountSummary from "@/components/features/dashboard/AccountSummary";
import AskToLoginPage from "@/components/features/auth/AskToLoginPage";
import {DashboardMonthProvider} from "@/context/DashboardMonthContext";
import MonthPicker from "@/components/features/dashboard/MonthPicker";
import DashboardLatestTransactions from "@/components/features/dashboard/DashboardLatestTransactions";

export default async function DashboardPage() {
  const session: Session | null = await auth();
  if (!session) {
    return <AskToLoginPage />
  }

  const user = session.user
  return (
    <main className="w-full">
      <h1 className="text-xl font-semibold">Dobry wieczór, {user?.name}</h1>

      <DashboardMonthProvider>
        <div className="mt-6 flex flex-col gap-4">
          <MonthPicker/>

          <AccountSummary/>

          <ExpenseChart/>

          <DashboardLatestTransactions/>

        </div>
      </DashboardMonthProvider>
    </main>
  );
}
