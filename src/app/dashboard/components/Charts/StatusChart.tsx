"use client";

import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

export default function StatusChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  // Mapeamento de cores baseado no nome
  const colorMap: Record<string, string> = {
    "Pendente": "#cad5e2",
    "Em Andamento": "#ffdf20",
    "Finalizado": "#7bf1a8",
  };

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorMap[entry.name] || "#8884d8"} // cor padrão se não estiver no map
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
