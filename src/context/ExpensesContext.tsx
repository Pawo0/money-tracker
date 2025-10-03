"use client"

import {createContext, useEffect, useState} from "react";
import type {ExpensesData, ExpensesContextInterface} from "@/types/expenses"

export const ExpensesContext = createContext<ExpensesContextInterface | null>(null)

export function ExpensesProvider({children}: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<ExpensesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses();
  }, [])


  const fetchExpenses = async function () {
    setLoading(true)
    try {
      const res = await fetch("/api/expenses");
      const data: ExpensesData[] = await res.json();
      // sort by date
      const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setExpenses(sortedData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ExpensesContext.Provider value={{expenses, loading, fetchExpenses}}>
      {children}
    </ExpensesContext.Provider>
  )
}