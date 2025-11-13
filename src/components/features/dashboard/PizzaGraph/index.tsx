import { PieChart } from "@mui/x-charts";

type PizzaGraphT = {
  data: {
    categoria: string;
    valor: number;
  }[];
};

export const PizzaGraph = ({ data }: PizzaGraphT) => {
  const filteredData = data
    .filter((d) => d.valor > 0)
    .map((d, index) => ({
      id: index,
      value: d.valor,
      label: d.categoria,
    }));

  return (
    <div className="p-3">
      <PieChart series={[{ data: filteredData }]}/>
    </div>
  );
};
