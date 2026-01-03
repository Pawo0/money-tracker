"use client";

import useExpenses from "@/hooks/useExpenses";
import useDashboardMonth from "@/hooks/useDashboardMonth";
import {useMemo} from "react";
import {sameMonth} from "@/lib/utils/date";
import LatestTransaction from "@/components/LatestTransactions";

export default function DashboardLatestTransactions() {
  const {expenses, loading} = useExpenses();
  const {selectedMonth} = useDashboardMonth();

  const filteredExpenses = useMemo(() =>{
    console.log("all expenses:", expenses);
    return expenses.filter(el => sameMonth(new Date(el.date), selectedMonth));
  }, [expenses, selectedMonth]);

  if (loading){
    return <div>Loading latest transactions...</div>
  }
  return <LatestTransaction expenses={filteredExpenses} limit={5} />
}