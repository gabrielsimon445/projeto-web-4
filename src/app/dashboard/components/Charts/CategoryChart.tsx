"use client";

import {
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  Pie,
  PieChart,
} from "recharts";

const COLORS = ["#3b82f6", "#facc15", "#22c55e"];

export default function CategoryBarChart({
  data,
}: {
  data: Array<{ category: string; tasks: number }>;
}) {
  const colorMap: Record<string, string> = {
    "Urgente": "#e7000b",
    "Equipe": "#c800de",
    "Pessoal": "#4f39f6",
  };
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="tasks"
            nameKey="category"
            outerRadius={90}
            label
          >
            {data.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill={colorMap[_.category] || "#8884d8"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
