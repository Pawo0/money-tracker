import type { ExpensesData } from "@/types/expenses";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CurrentCategoryIcon from "@/components/features/categories/CurrentCategoryIcon";
export default function TransactionBlock({
  transaction,
}: {
  transaction: ExpensesData;
}) {
  return (
    <Link className="transaction-row" href={`/history/${transaction._id}`}>
      <div className="transaction-name">
        <span
          className="category-icon"
          style={{ color: transaction.category?.color || "#486553" }}
        >
          <CurrentCategoryIcon
            categoryName={transaction.category?.icon}
            size={20}
          />
        </span>
        <div>
          <strong>{transaction.title}</strong>
          <span className="mobile-transaction-meta">
            {transaction.category?.name} ·{" "}
            {new Date(transaction.date).toLocaleDateString("en-GB")}
          </span>
        </div>
      </div>
      <span className="transaction-category">
        {transaction.category?.name || "Uncategorised"}
      </span>
      <span className="transaction-date">
        {new Date(transaction.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
      <strong
        className={
          transaction.amount < 0
            ? "transaction-amount"
            : "transaction-amount positive"
        }
      >
        {transaction.amount.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        <span> zł</span>
      </strong>
      <ArrowUpRight className="transaction-arrow" size={16} />
    </Link>
  );
}
