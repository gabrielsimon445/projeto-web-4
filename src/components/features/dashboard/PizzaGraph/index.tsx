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
    <>
      <PieChart series={[{ data: filteredData }]} width={200} height={250} />
    </>
  );
};
