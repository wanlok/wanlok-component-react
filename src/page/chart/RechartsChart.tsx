import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "2017", price: 80 },
  { name: "2018", price: 90 },
  { name: "2019", price: 100 },
  { name: "2020", price: 110 },
  { name: "2021", price: 120 }
];

const RechartsChart = () => {
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="red" isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RechartsChart;
