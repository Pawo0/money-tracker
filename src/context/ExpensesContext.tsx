"use client";

import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import type { ExpensesData, ExpensesContextInterface } from "@/types/expenses";

export const ExpensesContext = createContext<ExpensesContextInterface | null>(
  null,
);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<ExpensesData[]>([]);
  const [loading, setLoading] = useState(true);

  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (status === "authenticated") fetchExpenses();
    else if (status === "unauthenticated") {
      setExpenses([]);
      setLoading(false);
    }
  }, [status]);

  const fetchExpenses = async function () {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok)
        throw new Error("Unable to load transactions. Please try again.");
      const data: ExpensesData[] = await res.json();
      setExpenses(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExpensesContext.Provider
      value={{ expenses, loading, error, fetchExpenses }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
