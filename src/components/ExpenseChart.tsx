"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

import type {ChartData} from "chart.js";

import {Line} from "react-chartjs-2";
import {useEffect, useMemo, useState} from "react";
import useExpenses from "@/hooks/useExpenses";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function startOfMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, 1, 0, 0, 0, 0);
}

function endOfMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  // day 0 of next month = last day of current month
  return new Date(y, (m ?? 1), 0, 23, 59, 59, 999);
}

function sameMonth(a: Date, month: string) {
  return monthKey(a) === month;
}

function formatMonthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  const exp_date = new Date(y, (m ?? 1) - 1, 1);
  return exp_date.toLocaleDateString("en-EN", {month: "long", year: "numeric"});
}

export default function ExpenseChart() {
  const {expenses, loading} = useExpenses()

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    for (const exp of expenses) {
      const exp_date = new Date(exp.date);
      if (!Number.isNaN(exp_date.getTime())) {
        set.add(monthKey(exp_date));
      }
    }

    // fallback: pokaż przynajmniej bieżący miesiąc, nawet jak brak wydatków
    set.add(monthKey(new Date()));

    return Array.from(set).sort();
  }, [expenses]);

  const [selectedMonth, setSelectedMonth] = useState<string>(() => monthKey(new Date()));

  // jeżeli wpadną dane i aktualnie wybrany miesiąc nie istnieje na liście, ustaw na ostatni (najnowszy)
  useEffect(() => {
    if (!availableMonths.length) return;
    if (availableMonths.includes(selectedMonth)) return;
    setSelectedMonth(availableMonths[availableMonths.length - 1]);
  }, [availableMonths, selectedMonth]);

  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const now = new Date();
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    // dla bieżącego miesiąca: do dziś (nie do końca miesiąca)
    const rangeEnd = sameMonth(now, selectedMonth)
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      : monthEnd;

    const dailyTotals = expenses.reduce<Record<string, number>>((acc, exp) => {
      const exp_date = new Date(exp.date);
      if (Number.isNaN(exp_date.getTime())) return acc;
      if (exp_date < monthStart || exp_date > rangeEnd) return acc;

      const key = dayKey(exp_date);
      acc[key] = (acc[key] ?? 0) + exp.amount;
      return acc;
    }, {});

    const labels: string[] = [];
    const cumulative: number[] = [];

    let sum = 0;
    for (
      let cursor = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
      cursor <= rangeEnd;
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
    ) {
      const key = dayKey(cursor);
      sum += dailyTotals[key] ?? 0;

      labels.push(
        cursor.toLocaleDateString("en-EN", {
          day: "2-digit",
          month: "short",
        })
      );
      cumulative.push(sum);
    }

    setData({
      labels,
      datasets: [
        {
          label: "Expenses for the month",
          data: cumulative,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    });
  }, [expenses, selectedMonth]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full bg-gray-900 p-4 rounded-2xl shadow-md ">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-400">Expenses for the month</p>
          <p className="truncate text-base font-semibold text-gray-100">{formatMonthLabel(selectedMonth)}</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <span className="sr-only">Select month</span>
          <select
            className="rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-100 ring-1 ring-white/10"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {[...availableMonths].reverse().map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="w-full h-64">
        <Line
          className={"m-auto w-full"}
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {display: false},
              title: {display: false},
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const v = ctx.parsed.y;
                    return ` ${v.toLocaleString("pl-PL")} zł`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {color: "rgba(255,255,255,0.08)"},
                ticks: {maxTicksLimit: 8, color: "rgba(255,255,255,0.7)"},
              },
              y: {
                grid: {color: "rgba(255,255,255,0.08)"},
                ticks: {
                  color: "rgba(255,255,255,0.7)",
                  callback: (value) => `${Number(value).toLocaleString("pl-PL")} zł`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}