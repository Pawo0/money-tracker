"use client"

import useExpenses from "@/hooks/useExpenses";

export default function AccountSummary(){
  const {expenses, loading} = useExpenses()

  if (loading){
    return <p>Loading...</p>
  }
  const totalAmount = expenses.reduce((acc, exp) =>{
    return acc + exp.amount
  }, 0)
  const transactionCount = expenses.length

  return (
    <div className="p-4 bg-gray-800 rounded-2xl">
      <p className="text-sm text-gray-400">Wallet</p>
      <p className="text-2xl font-bold">{totalAmount.toFixed(2)} zł</p>
      <p className="text-xs text-gray-400">{transactionCount} transactions</p>
    </div>
  )
}