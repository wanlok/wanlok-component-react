import { Stack } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { ChartItem, Direction } from "../common/WTypes";
import { ControlGroup } from "./ControlGroup";

export const WChart = ({
  chartItem,
  width,
  leftMost = false,
  rightMost = false,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  chartItem: ChartItem;
  width: string;
  leftMost?: boolean;
  rightMost?: boolean;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ position: "relative", width, backgroundColor: "#EEEEEE" }}>
      <LineChart xAxis={[{ data: chartItem.x }]} series={[{ data: chartItem.y }]} height={300} />
      <ControlGroup direction={Direction.left} onDeleteButtonClick={onDeleteButtonClick} />
      <ControlGroup
        direction={Direction.right}
        onLeftButtonClick={leftMost ? undefined : onLeftButtonClick}
        onRightButtonClick={rightMost ? undefined : onRightButtonClick}
      />
    </Stack>
  );
};
