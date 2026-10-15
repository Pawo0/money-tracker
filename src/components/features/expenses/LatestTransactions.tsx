import Link from "next/link";
import { Receipt, ArrowUpRight } from "lucide-react";
import type { ExpensesData } from "@/types/expenses";
import { getIconByName } from "@/lib/utils/icons";
import { money } from "@/lib/utils/money";
export default function LatestTransaction({
  expenses,
  limit,
  demo = false,
  loading = false,
}: {
  expenses: ExpensesData[];
  limit?: number;
  demo?: boolean;
  loading?: boolean;
}) {
  const items = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  if (loading)
    return (
      <div className="table-loading">
        {[1, 2, 3].map((n) => (
          <div className="skeleton" key={n} />
        ))}
      </div>
    );
  if (!items.length)
    return (
      <div className="empty-state">
        <Receipt size={28} />
        <h3>A fresh start</h3>
        <p>
          No transactions here yet. Add an expense to start building your
          picture.
        </p>
        <Link className="button button-secondary" href="/add">
          Add your first expense <ArrowUpRight size={15} />
        </Link>
      </div>
    );
  return (
    <div className="transaction-table">
      <div className="table-head">
        <span>Transaction</span>
        <span>Category</span>
        <span>Date</span>
        <span>Amount</span>
      </div>
      {(limit ? items.slice(0, limit) : items).map((e) => {
        const Icon = getIconByName(e.category?.icon || "Receipt");
        const content = (
          <>
            <span className="transaction-name">
              <span
                className="transaction-icon"
                style={{
                  color: e.category?.color || "#b3beb6",
                  background: `${e.category?.color || "#b3beb6"}12`,
                }}
              >
                <Icon size={18} />
              </span>
              <span>
                <strong>{e.title}</strong>
                <small>
                  {new Date(e.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </small>
              </span>
            </span>
            <span className="category-pill">
              {e.category?.name || "Uncategorized"}
            </span>
            <span className="transaction-date">
              {new Date(e.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span
              className={`transaction-amount ${e.amount > 0 ? "positive" : ""}`}
            >
              {e.amount < 0 ? "−" : "+"}
              {money(Math.abs(e.amount))}
              <ArrowUpRight size={13} />
            </span>
          </>
        );
        return demo ? (
          <div className="transaction-row" key={e._id}>
            {content}
          </div>
        ) : (
          <Link
            className="transaction-row"
            href={`/history/${e._id}`}
            key={e._id}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
