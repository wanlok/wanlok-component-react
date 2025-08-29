import { Stack } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { ChartItem } from "../common/WTypes";
import { ControlGroup } from "./ControlGroup";

export const WChart = ({
  chartItem,
  width,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  chartItem: ChartItem;
  width: string;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ position: "relative", width, backgroundColor: "#EEEEEE" }}>
      <LineChart xAxis={[{ data: chartItem.x }]} series={[{ data: chartItem.y }]} height={300} />
      <ControlGroup
        onLeftButtonClick={onLeftButtonClick}
        onRightButtonClick={onRightButtonClick}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    </Stack>
  );
};
