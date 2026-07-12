import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "2017", price: 80 },
  { name: "2018", price: 90 },
  { name: "2019", price: 100 },
  { name: "2020", price: 110 },
  { name: "2021", price: 120 }
];

export const RechartsChart = () => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="red" isAnimationActive={false} />
    </LineChart>
  );
};
