"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SectorChartProps {
  data: { sector: string; total: number }[];
}

const COLORS = [
  "#e11d48", "#f43f5e", "#fb7185", "#fda4af",
  "#be123c", "#9f1239", "#881337", "#4c0519",
  "#f97316", "#fb923c", "#fdba74", "#fde68a",
  "#84cc16", "#22c55e",
];

export default function SectorChart({ data }: SectorChartProps) {
  const top = data.slice(0, 12);
  const chartData = {
    labels: top.map((d) => d.sector.replace(/-/g, " ")),
    datasets: [
      {
        data: top.map((d) => d.total),
        backgroundColor: COLORS.slice(0, top.length),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: { size: 11 },
          color: "#1c0010",
          boxWidth: 12,
          padding: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; raw: unknown }) => {
            const v = ctx.raw as number;
            return ` ${ctx.label}: ${v.toLocaleString()} jobs`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-72">
      <Pie data={chartData} options={options} />
    </div>
  );
}
