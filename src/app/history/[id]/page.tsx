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
import AccountGate from "@/components/features/auth/AccountGate";
import useExpenses from "@/hooks/useExpenses";
export default function TransactionDetailsPage() {
  return (
    <AccountGate>
      <TransactionDetails />
    </AccountGate>
  );
}
function TransactionDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { getExpense, deleteExpense, isDemo } = useExpenses();
  const [expense, setExpense] = useState<ExpensesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setExpense(null);
      setError("");
      try {
        const item = await getExpense(String(id), controller.signal);
        if (!controller.signal.aborted) setExpense(item);
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
  }, [id, retry, getExpense]);
  async function remove() {
    setBusy(true);
    setError("");
    try {
      await deleteExpense(String(id));
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
            {confirmDelete ? (
              <div
                className="delete-confirm"
                role="group"
                aria-label="Confirm deletion"
              >
                <h2>Delete this transaction?</h2>
                <p>
                  {isDemo
                    ? "This removes the expense from your demo. Reset demo restores the original sample data."
                    : "This permanently removes the expense from your account."}
                </p>
                <div className="form-actions">
                  <button
                    className="button button-secondary"
                    disabled={busy}
                    onClick={() => setConfirmDelete(false)}
                  >
                    Keep transaction
                  </button>
                  <button
                    className="button delete-confirm-action"
                    disabled={busy}
                    onClick={remove}
                  >
                    {busy ? "Deleting…" : "Confirm delete"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="danger-button"
                disabled={busy}
                onClick={() => setConfirmDelete(true)}
              >
                {busy ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}{" "}
                {busy ? "Deleting…" : "Delete transaction"}
              </button>
            )}
          </>
        )
      )}
    </main>
  );
}
