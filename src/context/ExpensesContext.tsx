"use client"

import {createContext, useEffect, useState} from "react";
import type {ExpensesData, ExpensesContextInterface} from "@/types/expenses"

export const ExpensesContext = createContext<ExpensesContextInterface | null>(null)

export function ExpensesProvider({children}: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<ExpensesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const expensesFetch = async function () {
      try {
        const res = await fetch("/api/expenses");
        const data: ExpensesData[] = await res.json();
        setExpenses(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    expensesFetch()
  }, [])

  return (
    <ExpensesContext.Provider value={{expenses, loading}}>
      {children}
    </ExpensesContext.Provider>
  )
}