import {format} from "date-fns";
import {pl} from "date-fns/locale";
import type {ExpensesData} from "@/types/expenses";
import Link from "next/link";

export default function TransactionBlock({transaction}: { transaction: ExpensesData }) {
  const formatted_date = format(new Date(transaction.date), "dd MMM yyyy", {locale: pl})
  return (
    <Link
      className="p-4 bg-gray-800 rounded-2xl text-left w-full cursor-pointer hover:bg-gray-700 transition-colors"
      href={`/history/${transaction._id}`}
    >
      <p className="text-gray-400 text-sm mb-2">{formatted_date}</p>
      <div className="flex justify-between items-center">
        <p>{transaction.title}</p>
        <p className={transaction.amount < 0 ? "text-red-500" : "text-green-500"}>{transaction.amount} zł</p>
      </div>
    </Link>
  );
}