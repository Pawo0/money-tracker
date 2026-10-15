import Link from "next/link";
import { ArrowUpRight, ReceiptText, Plus } from "lucide-react";
import TransactionBlock from "@/components/features/expenses/TransactionBlock";
import { ExpensesData } from "@/types/expenses";
type LatestTransactionProps = { expenses: ExpensesData[]; limit?: number };
export default function LatestTransaction({
  expenses,
  limit,
}: LatestTransactionProps) {
  const items = limit ? expenses.slice(0, limit) : expenses;
  return (
    <section className="transactions-panel">
      <div className="panel-heading">
        <div>
          <h2>{limit ? "Recent transactions" : "All transactions"}</h2>
          <p>
            {limit
              ? "The latest entries from your selected month."
              : "Every expense, all in one place."}
          </p>
        </div>
        {!!limit && (
          <Link className="text-link" href="/history">
            View all <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
      {items.length > 0 ? (
        <>
          <div className="transaction-table-head">
            <span>Transaction</span>
            <span>Category</span>
            <span>Date</span>
            <span>Amount</span>
            <span />
          </div>
          <div className="transaction-list">
            {items.map((transaction) => (
              <TransactionBlock
                key={transaction._id}
                transaction={transaction}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">
            <ReceiptText size={26} />
          </span>
          <h3>A fresh page</h3>
          <p>Add your first expense and it will appear here.</p>
          <Link className="text-link" href="/add">
            <Plus size={16} />
            Add expense
          </Link>
        </div>
      )}
    </section>
  );
}
