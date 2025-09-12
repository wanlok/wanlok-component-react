import { Stack } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { ChartItem, Direction } from "../services/Types";
import { ControlGroup } from "./ControlGroup";

export const WChart = ({
  chartItem,
  width,
  leftMost = false,
  rightMost = false,
  scrollHorizontally,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  chartItem: ChartItem;
  width: string;
  leftMost?: boolean;
  rightMost?: boolean;
  scrollHorizontally: boolean;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ position: "relative", width, backgroundColor: "#EEEEEE" }}>
      <LineChart xAxis={[{ data: chartItem.x }]} series={[{ data: chartItem.y }]} height={300} />
      <ControlGroup
        direction={Direction.right}
        scrollHorizontally={scrollHorizontally}
        onDeleteButtonClick={onDeleteButtonClick}
      />
      <ControlGroup
        direction={Direction.right}
        scrollHorizontally={scrollHorizontally}
        onLeftButtonClick={leftMost ? undefined : onLeftButtonClick}
        onRightButtonClick={rightMost ? undefined : onRightButtonClick}
      />
    </Stack>
  );
};
