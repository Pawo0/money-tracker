"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Plus,
  X,
  ChevronDown,
  Receipt,
  Loader2,
  Check,
  Tag,
} from "lucide-react";
import useExpenses from "@/hooks/useExpenses";
import AskToLoginPage from "@/components/features/auth/AskToLoginPage";
import CategoryModal from "@/components/features/categories/CategoryModal";
import CurrentCategoryIcon from "@/components/features/categories/CurrentCategoryIcon";
import type { ExpensesInputData } from "@/types/expenses";
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const fresh = (): ExpensesInputData => ({
  date: today(),
  amount: "",
  title: "",
  category: null,
  description: "",
});
export default function Page() {
  const { status } = useSession();
  const { addExpense, isDemo, ready } = useExpenses();
  const [inputs, setInputs] = useState(fresh);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    error: boolean;
    text: string;
  } | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  if (!ready || (!isDemo && status === "loading"))
    return <div className="skeleton h-80" aria-label="Loading your account" />;
  if (!isDemo && status !== "authenticated") return <AskToLoginPage />;
  const set = (key: keyof ExpensesInputData, value: string) =>
    setInputs((v) => ({ ...v, [key]: value }));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!inputs.category || !inputs.amount || Number(inputs.amount) <= 0) {
      setMessage({
        error: true,
        text: "Enter an amount greater than zero and choose a category.",
      });
      return;
    }
    setBusy(true);
    try {
      await addExpense({
        ...inputs,
        category: inputs.category,
        title: inputs.title.trim() || inputs.category.name,
        amount: -Number(inputs.amount),
      });
      setInputs(fresh());
      setMessage({
        error: false,
        text: "Expense added. Your overview is up to date.",
      });
      amountRef.current?.focus();
    } catch (e) {
      setMessage({
        error: true,
        text:
          e instanceof Error
            ? e.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }
  return (
    <main>
      <div className="page-heading">
        <div>
          <div className="eyebrow">BUILD A BETTER HABIT</div>
          <h1>
            Add expense<span className="heading-dot">.</span>
          </h1>
          <p>A few details now. A clearer picture later.</p>
        </div>
      </div>
      <div className="form-layout">
        <form className="panel expense-form" onSubmit={submit}>
          {message && (
            <div
              role={message.error ? "alert" : "status"}
              className={`feedback ${message.error ? "error" : ""}`}
            >
              {message.text}
            </div>
          )}
          <label className="field-label" htmlFor="amount">
            How much did you spend?
          </label>
          <div className="amount-field">
            <input
              id="amount"
              name="amount"
              ref={amountRef}
              inputMode="decimal"
              placeholder="0.00"
              autoComplete="off"
              required
              value={inputs.amount}
              onChange={(e) => {
                const v = e.target.value.replace(",", ".");
                if (/^\d*\.?\d{0,2}$/.test(v)) set("amount", v);
              }}
              aria-describedby="amount-hint"
            />
            <span>PLN</span>
            {inputs.amount && (
              <button
                type="button"
                className="icon-button"
                aria-label="Clear amount"
                onClick={() => {
                  set("amount", "");
                  amountRef.current?.focus();
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="quick-amounts" id="amount-hint">
            {[10, 25, 50, 100].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() =>
                  set("amount", (Number(inputs.amount || 0) + n).toFixed(2))
                }
              >
                + {n}
              </button>
            ))}
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="category">
                Category
              </label>
              <button
                id="category"
                className="field-input category-select"
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={() => setOpen(true)}
              >
                {inputs.category ? (
                  <CurrentCategoryIcon
                    categoryName={inputs.category.icon}
                    size={18}
                  />
                ) : (
                  <Tag size={17} />
                )}
                <span>{inputs.category?.name || "Choose a category"}</span>
                <ChevronDown size={15} />
              </button>
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="date">
                Date
              </label>
              <input
                className="field-input"
                id="date"
                type="date"
                required
                value={inputs.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
          </div>
          <div className="form-field">
            <label className="field-label" htmlFor="title">
              Transaction name <span>· optional</span>
            </label>
            <input
              className="field-input"
              id="title"
              placeholder="e.g. Weekly groceries"
              maxLength={150}
              value={inputs.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="field-label" htmlFor="description">
              Note <span>· optional</span>
            </label>
            <textarea
              id="description"
              className="field-input"
              placeholder="Anything you’d like to remember?"
              value={inputs.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="form-actions">
            <Link className="button button-secondary" href="/dashboard">
              Cancel
            </Link>
            <button
              type="submit"
              className="button button-primary"
              disabled={busy}
            >
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}{" "}
              {busy ? "Saving expense…" : "Add expense"}
            </button>
          </div>
          <CategoryModal
            isOpen={open}
            selectedCategory={inputs.category}
            onCloseAction={() => setOpen(false)}
            onSelectAction={(category) =>
              setInputs((v) => ({ ...v, category }))
            }
          />
        </form>
        <aside className="form-aside">
          <Receipt size={24} />
          <h2>
            It’s the small things
            <br />
            that add up.
          </h2>
          <p>
            From your morning coffee to a monthly bill, every expense helps you
            understand your spending.
          </p>
          <div className="aside-line" />
          <Check size={16} />
          <p>
            Pick a category to keep your spending breakdown organized. You can
            leave the name blank and we’ll use the category.
          </p>
        </aside>
      </div>
    </main>
  );
}
