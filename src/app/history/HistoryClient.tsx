"use client";
import { useMemo, useState } from "react";
import { Search, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import LatestTransaction from "@/components/features/expenses/LatestTransactions";
import useExpenses from "@/hooks/useExpenses";
import { money } from "@/lib/utils/money";
export default function HistoryClient() {
  const { expenses, loading, error, fetchExpenses } = useExpenses();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = [
    ...new Set(expenses.map((e) => e.category?.name || "Uncategorized")),
  ];
  const filtered = useMemo(
    () =>
      expenses.filter(
        (e) =>
          (category === "all" ||
            (e.category?.name || "Uncategorized") === category) &&
          `${e.title} ${e.category?.name || ""} ${e.description || ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [expenses, category, query],
  );
  return (
    <main>
      <div className="page-heading">
        <div>
          <div className="eyebrow">THE DETAILS BEHIND THE NUMBERS</div>
          <h1>
            Transactions<span className="heading-dot">.</span>
          </h1>
          <p>Every expense, in one place.</p>
        </div>
        <Link className="button button-primary" href="/add">
          <Plus size={16} /> Add expense
        </Link>
      </div>
      {error && (
        <div className="error-banner" role="alert">
          {error}
          <button onClick={fetchExpenses}>Try again</button>
        </div>
      )}
      <div className="history-tools">
        <label className="search-field">
          <Search size={16} />
          <input
            aria-label="Search transactions"
            placeholder="Search transactions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          className="filter-select"
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              {query || category !== "all"
                ? "Search results"
                : "All transactions"}{" "}
              <span className="muted">· {filtered.length}</span>
            </h2>
            <p>
              {loading
                ? "Loading your transactions…"
                : `${money(filtered.filter((e) => e.amount < 0).reduce((s, e) => s - e.amount, 0))} in expenses`}
            </p>
          </div>
          <ArrowUpRight size={17} className="muted" />
        </div>
        {!loading && (query || category !== "all") && !filtered.length ? (
          <div className="empty-state">
            <Search size={25} />
            <h3>No matching transactions</h3>
            <p>Try a different search or choose another category.</p>
            <button
              className="button button-secondary"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <LatestTransaction expenses={filtered} loading={loading} />
        )}
      </section>
    </main>
  );
}
