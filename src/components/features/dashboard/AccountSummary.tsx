"use client";

import useExpenses from "@/hooks/useExpenses";
import useDashboardMonth from "@/hooks/useDashboardMonth";
import { monthKey } from "@/lib/utils/date";

export default function AccountSummary() {
  const { expenses, loading } = useExpenses();
  const { selectedMonth, formatMonthLabel } = useDashboardMonth();

  if (loading) {
    return (
      <div className="summary-card skeleton" role="status">
        Loading summary…
      </div>
    );
  }

  const expensesForMonth = expenses.filter((exp) => {
    const d = new Date(exp.date);
    if (Number.isNaN(d.getTime())) return false;
    return monthKey(d) === selectedMonth;
  });

  const totalAmount = expensesForMonth.reduce((acc, exp) => {
    return acc + exp.amount;
  }, 0);
  const transactionCount = expensesForMonth.length;

  return (
    <section className="summary-card">
      <div className="summary-top">
        <span className="small-label">MONTHLY EXPENSES</span>
        <span className="summary-symbol">↗</span>
      </div>
      <p className="summary-month">{formatMonthLabel(selectedMonth)}</p>
      <p className="summary-amount">
        {totalAmount.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        <span>zł</span>
      </p>
      <div className="summary-bottom">
        <span>Total transactions</span>
        <strong>{transactionCount.toLocaleString("en-GB")}</strong>
      </div>
    </section>
  );
}
