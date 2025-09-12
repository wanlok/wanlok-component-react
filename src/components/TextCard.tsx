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
    <Stack
      sx={{
        position: "relative",
        width,
        aspectRatio: "16/9",
        backgroundColor: "#fff740",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Typography sx={{ p: 2 }}>{text}</Typography>
      {controlGroupState === 1 && (
        <ControlGroup
          direction={Direction.right}
          scrollHorizontally={scrollHorizontally}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      )}
      {controlGroupState === 2 && (
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
