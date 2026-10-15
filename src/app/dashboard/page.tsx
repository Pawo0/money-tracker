import ExpenseChart from "@/components/features/dashboard/ExpenseChart";
import { auth } from "@/auth";
import AccountSummary from "@/components/features/dashboard/AccountSummary";
import AskToLoginPage from "@/components/features/auth/AskToLoginPage";
import { DashboardMonthProvider } from "@/context/DashboardMonthContext";
import MonthPicker from "@/components/features/dashboard/MonthPicker";
import DashboardLatestTransactions from "@/components/features/dashboard/DashboardLatestTransactions";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
export default async function DashboardPage() {
  const session = await auth();
  if (!session) return <AskToLoginPage />;
  return (
    <main>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE PERSPECTIVE ON YOUR MONEY</span>
          <h1>Your money, at a glance</h1>
          <p>
            Hello, {session.user?.name}. Here’s how your month is shaping up.
          </p>
        </div>
        <Button href="/add">
          <Plus size={18} />
          Add expense
        </Button>
      </div>
      <DashboardMonthProvider>
        <MonthPicker />
        <div className="dashboard-grid">
          <AccountSummary />
          <ExpenseChart />
        </div>
        <DashboardLatestTransactions />
      </DashboardMonthProvider>
    </main>
  );
}
