import { Stack, Typography } from "@mui/material";
import { ControlGroup } from "./ControlGroup";
import { Direction } from "../services/Types";

export const TextCard = ({
  text,
  width,
  leftMost,
  rightMost,
  scrollHorizontally,
  controlGroupState,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  text: string;
  width: string;
  leftMost: boolean;
  rightMost: boolean;
  scrollHorizontally: boolean;
  controlGroupState: number;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ position: "relative", width }}>
      <Stack sx={{ aspectRatio: "4/3", backgroundColor: "#FFDE21" }}>
        <Typography sx={{ p: 2, whiteSpace: "pre-wrap" }}>{text}</Typography>
      </Stack>
      {controlGroupState === 2 && (
        <ControlGroup
          direction={Direction.right}
          scrollHorizontally={scrollHorizontally}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      )}
      {controlGroupState === 3 && (
        <ControlGroup
          direction={Direction.right}
          scrollHorizontally={scrollHorizontally}
          onLeftButtonClick={leftMost ? undefined : onLeftButtonClick}
          onRightButtonClick={rightMost ? undefined : onRightButtonClick}
        />
      )}
    </Stack>
  );
};
