"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

import type {ChartData} from "chart.js";

import {Line} from "react-chartjs-2";
import {useEffect, useState} from "react";
import useExpenses from "@/hooks/useExpenses";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function ExpenseChart() {
  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: []
  });

  const {expenses, loading} = useExpenses()

  useEffect(() => {
    const result = expenses.reduce<Record<string, number>>((acc, exp) => {
      const data = new Date(exp.date).toLocaleDateString("pl-PL", {day: "2-digit", month: "short"})
      acc[data] = (acc[data] ?? 0) + exp.amount
      return acc
    }, {})


    setData({
      labels: Object.keys(result),
      datasets: [
        {
          label: "Saldo",
          data: Object.values(result),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.4, // wygładzenie linii
        },
      ],
    })
  }, [expenses]);


  if (!data || loading) return <p>Ładowanie...</p>;

  return (
    <div className="w-full  bg-gray-900 p-4 rounded-2xl shadow-md">
      <Line
        className={"m-auto w-full"}
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {display: false},
            title: {display: false},
          },
          scales: {
            x: {grid: {color: "rgba(255,255,255,0.1)"}},
            y: {grid: {color: "rgba(255,255,255,0.1)"}},
          },
        }}
      />
    </div>
  );
}