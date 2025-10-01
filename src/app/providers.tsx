"use client"

import {SessionProvider} from "next-auth/react";
import {ExpensesProvider} from "@/context/ExpensesContext";

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ExpensesProvider>
        {children}
      </ExpensesProvider>
    </SessionProvider>
  )
}