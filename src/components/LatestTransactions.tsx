import Button from "@/components/Button";
import TransactionBlock from "@/components/TransactionBlock";
import {ExpensesData} from "@/types/expenses";

type LatestTransactionProps = {
  expenses: ExpensesData[];
  limit?: number;
}

export default function LatestTransaction({expenses, limit}: LatestTransactionProps) {
  const items = limit ? expenses.slice(0, limit) : expenses;
  const elements = items.map((transaction) => {
    return <TransactionBlock transaction={transaction} key={transaction._id}/>
  })

  return (
    <>
      <div className={"flex flex-col gap-4"}>
        {elements}
        {
          !!limit &&
            <Button variant={"secondary"} className={"text-center w-3/4 mx-auto"} href={"/history"}>
                See full history
            </Button>
        }
      </div>
    </>
  )
}