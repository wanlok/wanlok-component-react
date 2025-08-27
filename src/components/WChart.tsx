import { Stack } from "@mui/material";
import { WIconButton } from "./WButton";
import CrossWhiteIcon from "../assets/images/icons/cross-white.png";
import { LineChart } from "@mui/x-charts";
import { ChartItem } from "../common/Bookmark";

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
      <WIconButton
        icon={CrossWhiteIcon}
        iconSize={16}
        onClick={onDeleteButtonClick}
        sx={{ position: "absolute", top: 0, right: 0, backgroundColor: "common.black", zIndex: 999 }}
      />
      <LineChart xAxis={[{ data: chartItem.x }]} series={[{ data: chartItem.y }]} height={300} />
    </Stack>
  );
};
