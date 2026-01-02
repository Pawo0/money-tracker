"use client"

import React, {createContext, useEffect, useMemo, useState} from "react";
import useExpenses from "@/hooks/useExpenses";
import type {MonthKey} from "@/lib/utlis/date";
import {monthKey, formatMonthLabel, sortMonths} from "@/lib/utlis/date";

export type DashboardMonthContextValue = {
  selectedMonth: MonthKey;
  setSelectedMonth: (month: MonthKey) => void;
  availableMonths: MonthKey[];
  formatMonthLabel: (month: MonthKey) => string;
};

export const DashboardMonthContext = createContext<DashboardMonthContextValue | null>(null)


export function DashboardMonthProvider({children}: { children: React.ReactNode }) {
  const {expenses} = useExpenses();


  const availableMonths = useMemo<MonthKey[]>(() => {
    const set = new Set<MonthKey>();
    for (const exp of expenses) {
      const d = new Date(exp.date);
      if (!Number.isNaN(d.getTime())) {
        set.add(monthKey(d));
      }
    }

    // fallback: pokaż przynajmniej bieżący miesiąc
    set.add(monthKey(new Date()));

    return sortMonths(Array.from(set));
  }, [expenses]);

  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(() => monthKey(new Date()));

  // jesli wybrany miesiac zostal usuniety, to ustaw najnowszy dostepny
  useEffect(() => {
    if (!availableMonths.length) return;
    if (availableMonths.includes(selectedMonth)) return;
    setSelectedMonth(availableMonths[availableMonths.length - 1]);
  }, [availableMonths, selectedMonth]);

  const value = useMemo<DashboardMonthContextValue>(
    () => ({
      selectedMonth,
      setSelectedMonth,
      availableMonths,
      formatMonthLabel,
    }),
    [selectedMonth, availableMonths]
  );

  return (
    <DashboardMonthContext.Provider value={value}>
      {children}
    </DashboardMonthContext.Provider>
  )
}