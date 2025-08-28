import { Stack } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { ChartItem } from "../common/Collection";
import { ControlGroup } from "./ControlGroup";

export const WChart = ({
  chartItem,
  width,
  onDeleteButtonClick
}: {
  chartItem: ChartItem;
  width: string;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ position: "relative", width, backgroundColor: "#EEEEEE" }}>
      <LineChart xAxis={[{ data: chartItem.x }]} series={[{ data: chartItem.y }]} height={300} />
      <ControlGroup onDeleteButtonClick={onDeleteButtonClick} />
    </Stack>
  );
};
