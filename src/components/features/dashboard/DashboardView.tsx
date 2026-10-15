"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ArrowRight,
  Info,
} from "lucide-react";
import { DashboardMonthProvider } from "@/context/DashboardMonthContext";
import useDashboardMonth from "@/hooks/useDashboardMonth";
import useExpenses from "@/hooks/useExpenses";
import ExpenseChart from "./ExpenseChart";
import LatestTransaction from "@/components/features/expenses/LatestTransactions";
import { money } from "@/lib/utils/money";
import { monthKey } from "@/lib/utils/date";
import { createDemoExpenses } from "@/lib/demo";
import DemoButton from "../auth/DemoButton";
import GoogleButton from "../auth/GoogleButton";

export default function DashboardView({
  demo = false,
  name,
}: {
  demo?: boolean;
  name?: string | null;
}) {
  return (
    <DashboardMonthProvider>
      <DashboardContent demo={demo} name={name} />
    </DashboardMonthProvider>
  );
}
function DashboardContent({
  demo,
  name,
}: {
  demo: boolean;
  name?: string | null;
}) {
  const { expenses, loading, error, fetchExpenses, isDemo, ready } =
    useExpenses();
  const preview = demo && !isDemo;
  const [demoExpenses] = useState(createDemoExpenses);
  const { selectedMonth, setSelectedMonth, availableMonths, formatMonthLabel } =
    useDashboardMonth();
  const [demoMonth, setDemoMonth] = useState(monthKey(new Date()));
  const month = preview ? demoMonth : selectedMonth;
  const all = preview ? demoExpenses : expenses;
  const current = useMemo(
    () => all.filter((e) => monthKey(new Date(e.date)) === month),
    [all, month],
  );
  const spending = current.filter((e) => e.amount < 0);
  const total = spending.reduce((s, e) => s - e.amount, 0);
  const count = spending.length;
  const groups = Object.values(
    spending.reduce<
      Record<string, { name: string; color: string; amount: number }>
    >((a, e) => {
      const key = e.category?.name || "Uncategorized";
      a[key] ??= {
        name: key,
        color: e.category?.color || "#9cbda9",
        amount: 0,
      };
      a[key].amount -= e.amount;
      return a;
    }, {}),
  ).sort((a, b) => b.amount - a.amount);
  const months = preview
    ? [
        monthKey(
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        ),
        monthKey(new Date()),
      ]
    : availableMonths;
  const index = months.indexOf(month);
  const choose = (value: typeof month) =>
    preview ? setDemoMonth(value) : setSelectedMonth(value);
  const busy = !preview && loading;
  if (!ready)
    return <div className="skeleton h-80" aria-label="Loading your account" />;
  return (
    <main>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR MONEY, AT A GLANCE</div>
          <h1>
            Overview<span className="heading-dot">.</span>
          </h1>
          <p>
            {isDemo
              ? "Welcome back, Alex. "
              : name
                ? `Welcome back, ${name.split(" ")[0]}. `
                : ""}
            A little clarity for your everyday finances.
          </p>
        </div>
        <Link className="button button-primary" href="/add">
          <Plus size={17} /> Add expense
        </Link>
      </div>
      {preview && (
        <div className="demo-banner">
          <span>
            <Info size={16} />
            <span>
              You’re exploring a preview.{" "}
              <span className="muted">Sample data, real possibilities.</span>
            </span>
          </span>
          <div className="demo-actions">
            <DemoButton />
            <GoogleButton variant="secondary" />
          </div>
        </div>
      )}
      {!preview && !isDemo && error && (
        <div className="error-banner" role="alert">
          {error}
          <button onClick={fetchExpenses}>Try again</button>
        </div>
      )}
      <div className="section-toolbar">
        <div className="section-label">
          <span className="status-dot" /> Monthly snapshot
        </div>
        <div className="month-control">
          <button
            aria-label="Previous month"
            disabled={index <= 0}
            onClick={() => choose(months[index - 1])}
          >
            <ChevronLeft size={16} />
          </button>
          <label>
            <CalendarDays size={15} />
            <select
              aria-label="Select month"
              value={month}
              onChange={(e) => choose(e.target.value as typeof month)}
            >
              {[...months].reverse().map((m) => (
                <option value={m} key={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
            </select>
          </label>
          <button
            aria-label="Next month"
            disabled={index >= months.length - 1}
            onClick={() => choose(months[index + 1])}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="metrics">
        <div className="metric metric-featured">
          <div className="metric-label">
            Total spent{" "}
            <span className="metric-icon">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <div className={busy ? "skeleton metric-value" : "metric-value"}>
            {busy ? " " : money(total)}
          </div>
          <div className="metric-foot">
            <span className="mint-dot" /> {formatMonthLabel(month)}
          </div>
        </div>
        <div className="metric">
          <div className="metric-label">
            Daily average <TrendingUp size={17} />
          </div>
          <div className={busy ? "skeleton metric-value" : "metric-value"}>
            {busy
              ? " "
              : money(
                  total /
                    (month === monthKey(new Date())
                      ? new Date().getDate()
                      : new Date(
                          Number(month.split("-")[1]),
                          Number(month.split("-")[0]),
                          0,
                        ).getDate()),
                )}
          </div>
          <div className="metric-foot">Across the selected period</div>
        </div>
        <div className="metric">
          <div className="metric-label">
            Transactions <Receipt size={17} />
          </div>
          <div className={busy ? "skeleton metric-value" : "metric-value"}>
            {busy ? " " : count}
            <span className="metric-unit">expenses</span>
          </div>
          <div className="metric-foot">{groups.length} spending categories</div>
        </div>
      </div>
      <div className="analytics-grid">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Spending activity</h2>
              <p>How your expenses add up over the month</p>
            </div>
            <span className="chart-legend">
              <i /> Expenses
            </span>
          </div>
          <ExpenseChart
            expensesOverride={preview ? current : undefined}
            monthOverride={preview ? month : undefined}
          />
          <div className="chart-footer">
            <ArrowDownLeft size={14} />
            <span>Every expense is a step toward a clearer picture.</span>
          </div>
        </section>
        <section className="panel categories-panel">
          <div className="panel-heading">
            <div>
              <h2>By category</h2>
              <p>Where your money goes</p>
            </div>
            <span className="subtle-icon">
              <ArrowUpRight size={17} />
            </span>
          </div>
          {groups.length ? (
            <>
              <div className="category-total">
                <span>{money(total)}</span>
                <small>Total expenses</small>
              </div>
              <div className="category-bar">
                {groups.map((g) => (
                  <div
                    key={g.name}
                    style={{
                      width: `${(g.amount / total) * 100}%`,
                      background: g.color,
                    }}
                    title={`${g.name}: ${money(g.amount)}`}
                  />
                ))}
              </div>
              <div className="category-list">
                {groups.map((g) => (
                  <div key={g.name}>
                    <span>
                      <i style={{ background: g.color }} />
                      {g.name}
                    </span>
                    <strong>
                      {money(g.amount)}
                      <small>{Math.round((g.amount / total) * 100)}%</small>
                    </strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Receipt size={27} />
              <h3>No spending yet</h3>
              <p>Your categories will appear after your first expense.</p>
            </div>
          )}
        </section>
      </div>
      <section className="panel transactions-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent transactions</h2>
            <p>Your latest expenses, all in one place</p>
          </div>
          <Link className="text-link" href="/history">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <LatestTransaction
          expenses={current}
          limit={5}
          demo={preview}
          loading={busy}
        />
      </section>
      <div className="overview-end">
        <span className="status-dot" />{" "}
        {preview
          ? "Preview mode · Sample transactions"
          : "Your finances. A little more organized."}
      </div>
    </main>
  );
}
