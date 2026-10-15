"use client";
import LatestTransaction from "@/components/features/expenses/LatestTransactions";
import useExpenses from "@/hooks/useExpenses";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
export default function HistoryClient() {
  const { expenses, loading } = useExpenses();
  return (
    <main>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR EVERYDAY MONEY JOURNAL</span>
          <h1>Transaction history</h1>
          <p>Look back at the details. Know where your money goes.</p>
        </div>
        <Button href="/add">
          <Plus size={18} />
          Add expense
        </Button>
      </div>
      {loading ? (
        <div className="loading-panel" role="status">
          Loading transactions…
        </div>
      ) : (
        <LatestTransaction expenses={expenses} />
      )}
    </main>
  );
}
