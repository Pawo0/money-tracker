"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Tag,
  Trash2,
  Loader2,
  Clock,
  SquarePen,
} from "lucide-react";
import CurrentCategoryIcon from "@/components/features/categories/CurrentCategoryIcon";
import type { ExpensesData } from "@/types/expenses";
import useExpenses from "@/hooks/useExpenses";

export default function TransactionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [expense, setExpense] = useState<ExpensesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { fetchExpenses } = useExpenses();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(`/api/expenses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExpense(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransaction();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchExpenses();
        router.back();
        router.refresh();
      } else {
        alert("There was an error deleting the transaction.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error occurred while deleting the transaction.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="loading-panel skeleton" role="status">
        Loading transaction…
      </div>
    );
  if (!expense)
    return (
      <div className="empty-state">
        <FileText size={30} />
        <h1>Transaction not found</h1>
        <p>This transaction may have been removed.</p>
        <button
          className="button button-secondary"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Go back
        </button>
      </div>
    );

  return (
    <main className="detail-page">
      <button onClick={() => router.back()} className="back-link">
        <ArrowLeft size={17} />
        Back to transactions
      </button>
      <div className="page-heading">
        <div>
          <span className="eyebrow">EVERY EXPENSE HAS A STORY</span>
          <h1>Transaction details</h1>
        </div>
        <span className="detail-type">
          {expense.amount < 0 ? "Expense" : "Income"}
        </span>
      </div>
      <section className="detail-card">
        <div className="detail-hero">
          <span
            className="detail-category-icon"
            style={{ color: expense.category?.color || "#46614d" }}
          >
            <CurrentCategoryIcon
              categoryName={expense.category?.icon}
              size={32}
            />
          </span>
          <p>{expense.category?.name}</p>
          <h2>
            {expense.amount.toLocaleString("en-GB", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span>zł</span>
          </h2>
          <h3>{expense.title}</h3>
        </div>
        <dl className="detail-list">
          <div>
            <dt>
              <Calendar size={18} />
              Transaction date
            </dt>
            <dd>
              {new Date(expense.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
          <div>
            <dt>
              <Tag size={18} />
              Category
            </dt>
            <dd>
              <span
                className="category-color"
                style={{ backgroundColor: expense.category?.color }}
              />
              {expense.category?.name || "Uncategorised"}
            </dd>
          </div>
          {expense.description && (
            <div className="detail-description">
              <dt>
                <FileText size={18} />
                Note
              </dt>
              <dd>{expense.description}</dd>
            </div>
          )}
        </dl>
        <div className="detail-timestamps">
          {expense.created_at && (
            <span>
              <Clock size={13} />
              Created{" "}
              {new Date(expense.created_at).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {expense.updated_at && expense.updated_at !== expense.created_at && (
            <span>
              <SquarePen size={13} />
              Updated{" "}
              {new Date(expense.updated_at).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <div className="detail-delete">
          <p>Need to remove this entry?</p>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="button button-danger"
          >
            {isDeleting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Delete transaction
              </>
            )}
          </button>
        </div>
      </section>
    </main>
  );
}
