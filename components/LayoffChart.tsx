"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface LayoffChartProps {
  data: { month: string; total: number }[];
  title?: string;
}

export default function LayoffChart({ data, title }: LayoffChartProps) {
  const labels = data.map((d) => {
    const [year, month] = d.month.split("-");
    return new Date(`${year}-${month}-01`).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Jobs Cut",
        data: data.map((d) => d.total),
        backgroundColor: "rgba(225,29,72,0.7)",
        borderColor: "rgba(225,29,72,1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: title
        ? { display: true, text: title, color: "#1c0010", font: { size: 14 } }
        : { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => {
            const v = ctx.raw as number;
            return ` ${v.toLocaleString()} jobs cut`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9f1239", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(253,164,175,0.3)" },
        ticks: {
          color: "#9f1239",
          font: { size: 11 },
          callback: (v: string | number) => {
            const n = typeof v === "number" ? v : parseFloat(v);
            return n >= 1000 ? `${n / 1000}k` : n;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-64 md:h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
