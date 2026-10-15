"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useExpenses from "@/hooks/useExpenses";
import useDashboardMonth from "@/hooks/useDashboardMonth";
import { dayKey, startOfMonth, endOfMonth, sameMonth } from "@/lib/utils/date";
import { money } from "@/lib/utils/money";
import type { ExpensesData } from "@/types/expenses";
import type { MonthKey } from "@/lib/utils/date";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);
export default function ExpenseChart({
  expensesOverride,
  monthOverride,
}: {
  expensesOverride?: ExpensesData[];
  monthOverride?: MonthKey;
}) {
  const { expenses, loading } = useExpenses();
  const { selectedMonth } = useDashboardMonth();
  const month = monthOverride || selectedMonth;
  const start = startOfMonth(month);
  const end = sameMonth(new Date(), month) ? new Date() : endOfMonth(month);
  const daily: Record<string, number> = {};
  for (const e of expensesOverride || expenses) {
    const d = new Date(e.date);
    if (d >= start && d <= end && e.amount < 0)
      daily[dayKey(d)] = (daily[dayKey(d)] || 0) - e.amount;
  }
  const labels: string[] = [];
  const values: number[] = [];
  let total = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    labels.push(
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    );
    total += daily[dayKey(d)] || 0;
    values.push(total);
  }
  if (loading && !expensesOverride)
    return (
      <div
        className="chart-area skeleton"
        aria-label="Loading spending chart"
      />
    );
  return (
    <div className="chart-area">
      <Line
        role="img"
        aria-label="Cumulative expenses for the selected month"
        data={{
          labels,
          datasets: [
            {
              label: "Expenses",
              data: values,
              borderColor: "#a4cbb4",
              backgroundColor: (context) => {
                const gradient = context.chart.ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  245,
                );
                gradient.addColorStop(0, "rgba(155,198,173,.18)");
                gradient.addColorStop(1, "rgba(155,198,173,0)");
                return gradient;
              },
              fill: true,
              tension: 0.28,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 2,
            },
          ],
        }}
        options={{
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#242826",
              titleColor: "#b8bcb9",
              bodyColor: "#f1f3f1",
              padding: 12,
              displayColors: false,
              callbacks: { label: (c) => money(c.parsed.y ?? 0) },
            },
          },
          scales: {
            x: {
              border: { display: false },
              grid: { display: false },
              ticks: {
                color: "#898e8b",
                maxTicksLimit: 6,
                maxRotation: 0,
                font: { size: 10 },
                padding: 12,
              },
            },
            y: {
              border: { display: false },
              beginAtZero: true,
              grid: { color: "#272c29" },
              ticks: {
                color: "#898e8b",
                maxTicksLimit: 5,
                font: { size: 10 },
                padding: 10,
                callback: (v) => `${Number(v).toLocaleString("en-GB")}`,
              },
            },
          },
        }}
      />
    </div>
  );
}
