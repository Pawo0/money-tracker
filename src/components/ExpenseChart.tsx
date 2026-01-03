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
import {useEffect, useRef, useState} from "react";
import useExpenses from "@/hooks/useExpenses";
import useDashboardMonth from "@/hooks/useDashboardMonth";
import {endOfMonth, sameMonth, startOfMonth, dayKey} from "@/lib/utils/date";

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
  const chartRef = useRef<ChartJS<"line">>(null);

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
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 3,
          borderWidth: 2,
        },
        {
          label: "Budget",
          data: labels.map(() => -1000),
          borderColor: "rgba(255,99,132,0.8)",
          borderDash: [6, 6],
          pointRadius: 0,
        }
      ],
    });
  }, [expenses, selectedMonth]);

  if (loading) return (
    <div className="w-full bg-gray-900 p-4 rounded-2xl shadow-md h-72 animate-pulse">
      <div className="h-full w-full bg-gray-800 rounded-xl"></div>
    </div>
  );

  return (
    <div className="w-full bg-gray-900 p-4 rounded-2xl shadow-md ">

      <div className="w-full h-64">
        <Line
          ref={chartRef}
          className={"m-auto w-full"}
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              legend: {display: false},
              title: {display: false},
              tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                  label: (ctx) => {
                    if (ctx.dataset.label === "Budget") return [];

                    const current = ctx.parsed.y;
                    const data = ctx.dataset.data as number[];
                    const prev = ctx.dataIndex > 0 ? data[ctx.dataIndex - 1] : 0;
                    const delta = current - prev;

                    return [
                      `Sum: ${current.toLocaleString("pl-PL")} zł`,
                      `Today: ${delta.toLocaleString("pl-PL")} zł`,
                    ];
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {color: "rgba(255,255,255,0.08)"},
                ticks: {
                  maxTicksLimit: 7,
                  color: "rgba(255,255,255,0.7)",
                  font: {size: 11}
                },
              },
              y: {
                beginAtZero: true,
                grid: {color: "rgba(255,255,255,0.08)"},
                ticks: {
                  color: "rgba(255,255,255,0.7)",
                  font: {size: 11},
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