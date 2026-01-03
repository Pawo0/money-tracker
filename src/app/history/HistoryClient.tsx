"use client"

import LatestTransaction from "@/components/features/expenses/LatestTransactions";
import useExpenses from "@/hooks/useExpenses";

export default function HistoryClient() {
  const {expenses} = useExpenses();

  return (
    <>
      <h1>History</h1>
      <LatestTransaction expenses={expenses} />
    </>
  )
}
