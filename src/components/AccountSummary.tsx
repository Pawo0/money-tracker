"use client"

import useExpenses from "@/hooks/useExpenses";
import useDashboardMonth from "@/hooks/useDashboardMonth";
import {monthKey} from "@/lib/utlis/date";

export default function AccountSummary(){
  const {expenses, loading} = useExpenses()
  const {selectedMonth, formatMonthLabel} = useDashboardMonth();

  if (loading){
    return <p>Loading...</p>
  }

  const expensesForMonth = expenses.filter((exp) => {
    const d = new Date(exp.date);
    if (Number.isNaN(d.getTime())) return false;
    return monthKey(d) === selectedMonth;
  });

  const totalAmount = expensesForMonth.reduce((acc, exp) =>{
    return acc + exp.amount
  }, 0)
  const transactionCount = expensesForMonth.length

  return (
    <div className="p-4 bg-gray-800 rounded-2xl">
      <p className="text-sm text-gray-400">Wallet • {formatMonthLabel(selectedMonth)}</p>
      <p className="text-2xl font-bold">{totalAmount.toFixed(2)} zł</p>
      <p className="text-xs text-gray-400">{transactionCount} transactions</p>
    </div>
  )
}