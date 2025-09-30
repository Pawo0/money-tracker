"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, ChartData
} from "chart.js"


import {Line} from "react-chartjs-2";
import {useEffect, useState} from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ExpanseData {
  _id: string;
  userId: string;
  date: string;
  amount: number;
  category: string;
  title: string
}

interface DataSet {
  labels: string,
  datasets: [
    {
      label: string,
      data: number[],
      borderColor: string,
      backgroundColor: string,
      tension: number
    }
  ]
}

export default function ExpenseChart() {
  const [data, setData] = useState<ChartData<"line", DataSet[], string>>();

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((expenses) => {
        // mapowanie danych pod Chart.js
        const labels = expenses.map((exp: ExpanseData) =>
          new Date(exp.date).toLocaleDateString("pl-PL", {day: "2-digit", month: "short"})
        );

        const values = expenses.map((exp: ExpanseData) => exp.amount);

        setData({
          labels,
          datasets: [
            {
              label: "Saldo",
              data: values,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.4, // wygładzenie linii
            },
          ],
        });
      });
  }, []);

  if (!data) return <p>Ładowanie...</p>;

  return (
    <div className="w-full h-64 bg-gray-900 p-4 rounded-2xl shadow-md">
      <Line
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