import {useContext} from "react"
import {ExpensesContext} from "@/context/ExpensesContext";


export default function useExpenses(){
  const ctx = useContext(ExpensesContext)
  if (!ctx) throw new Error("missing provider for ExpensesContext")
  return ctx
}