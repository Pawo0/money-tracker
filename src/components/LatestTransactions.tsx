"use client"

import useExpenses from "@/hooks/useExpenses";
import Button from "@/components/Button";
import TransactionBlock from "@/components/TransactionBlock";

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
    return <TransactionBlock transaction={transaction} key={transaction._id}/>
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