"use client"

import useExpenses from "@/hooks/useExpenses";

export default function LatestTransaction({amount = 5}: { amount?: number }) {
  const {expenses, loading} = useExpenses();

  if (loading) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }
  const latest = expenses.slice(-amount)
  const elements = latest.map((transaction) =>{
    return (
      <div className="p-4 bg-gray-800 rounded-2xl" key={transaction._id}>
        <p className="text-gray-400 text-sm mb-2">{transaction.date}</p>
        <div className="flex justify-between items-center">
          <p>{transaction.title}</p>
          <p className="text-red-400">{transaction.amount} zł</p>
        </div>
      </div>
    )
  })

  return (
    <>
      {elements}
    </>
  )
}