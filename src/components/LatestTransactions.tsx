"use client"

import useExpenses from "@/hooks/useExpenses";
import Button from "@/components/Button";
import {format} from "date-fns"
import {pl} from "date-fns/locale"

export default function LatestTransaction({showAll, amount = 5}: { amount?: number, showAll?: boolean }) {
  const {expenses, loading} = useExpenses();

  if (loading) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }
  let latest;

  if (showAll) {
    latest = expenses.slice().reverse();
  } else {
    latest = expenses.slice(-amount).reverse();
  }

  const elements = latest.map((transaction) => {

    const formatted = format(new Date(transaction.date), "dd MMM yyyy", {locale: pl})
    return (
      <div className="p-4 bg-gray-800 rounded-2xl" key={transaction._id}>
        <p className="text-gray-400 text-sm mb-2">{formatted}</p>
        <div className="flex justify-between items-center">
          <p>{transaction.title}</p>
          <p className="text-red-400">{transaction.amount} zł</p>
        </div>
      </div>
    )
  })

  return (
    <>
      <div className={"flex flex-col gap-4"}>
        {elements}
        {
          !showAll &&
            <Button variant={"secondary"} className={"text-center w-3/4 mx-auto"} href={"/history"}>
                See full history
            </Button>
        }
      </div>
    </>
  )
}