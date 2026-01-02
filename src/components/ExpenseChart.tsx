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
import {useEffect, useState} from "react";
import useExpenses from "@/hooks/useExpenses";
import useDashboardMonth from "@/hooks/useDashboardMonth";
import {endOfMonth, sameMonth, startOfMonth, dayKey} from "@/lib/utlis/date";

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

export default function ExpenseChart() {
  const {expenses, loading} = useExpenses()
  const {selectedMonth} = useDashboardMonth();

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