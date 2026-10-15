"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Tag,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";
import CurrentCategoryIcon from "@/components/features/categories/CurrentCategoryIcon";
import { money } from "@/lib/utils/money";
import type { ExpensesData } from "@/types/expenses";
import useExpenses from "@/hooks/useExpenses";
export default function TransactionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchExpenses } = useExpenses();
  const [expense, setExpense] = useState<ExpensesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/expenses/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok)
          throw new Error(
            res.status === 404
              ? "This transaction could not be found."
              : "Unable to load this transaction.",
          );
        setExpense(await res.json());
      } catch (e) {
        if (!controller.signal.aborted)
          setError(
            e instanceof Error ? e.message : "Unable to load transaction.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    if (id) load();
    return () => controller.abort();
  }, [id, retry]);
  async function remove() {
    if (!window.confirm("Delete this transaction? This cannot be undone."))
      return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok)
        throw new Error("Unable to delete the transaction. Please try again.");
      await fetchExpenses();
      router.push("/history");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to delete transaction.",
      );
      setBusy(false);
    }
  }
  return (
    <main className="details-wrap">
      <Link href="/history" className="back-link">
        <ArrowLeft size={16} /> All transactions
      </Link>
      {error && (
        <div className="error-banner" role="alert">
          {error}
          {!expense && (
            <button onClick={() => setRetry((v) => v + 1)}>Try again</button>
          )}
        </div>
      )}
      {loading ? (
        <div className="panel skeleton h-96" aria-label="Loading transaction" />
      ) : (
        expense && (
          <>
            <section className="panel">
              <div className="details-hero">
                <span className="eyebrow">TRANSACTION DETAILS</span>
                <div
                  className="details-icon"
                  style={{ color: expense.category?.color }}
                >
                  <CurrentCategoryIcon
                    categoryName={expense.category?.icon}
                    size={30}
                  />
                </div>
                <h1>
                  {expense.amount < 0 ? "−" : "+"}
                  {money(Math.abs(expense.amount))}
                </h1>
                <p>{expense.title}</p>
              </div>
              <div className="detail-list">
                <div>
                  <CalendarDays size={20} />
                  <span>
                    <small>Date</small>
                    <p>
                      {new Date(expense.date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </span>
                </div>
                <div>
                  <Tag size={20} />
                  <span>
                    <small>Category</small>
                    <p>{expense.category?.name || "Uncategorized"}</p>
                  </span>
                </div>
                {expense.description && (
                  <div>
                    <FileText size={20} />
                    <span>
                      <small>Note</small>
                      <p>{expense.description}</p>
                    </span>
                  </div>
                )}
              </div>
            </section>
            {expense.created_at && (
              <p className="details-meta">
                Added {new Date(expense.created_at).toLocaleString("en-GB")}
              </p>
            )}
            <button className="danger-button" disabled={busy} onClick={remove}>
              {busy ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}{" "}
              {busy ? "Deleting…" : "Delete transaction"}
            </button>
          </>
        )
      )}
    </main>
  );
}
