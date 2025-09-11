import { Stack, Typography } from "@mui/material";
import { ControlGroup } from "./ControlGroup";
import { Direction } from "../services/Types";

export const TextCard = ({
  text,
  width,
  leftMost = false,
  rightMost = false,
  scrollHorizontally = false,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  text: string;
  width: string;
  leftMost?: boolean;
  rightMost?: boolean;
  scrollHorizontally?: boolean;
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
      <ControlGroup
        direction={Direction.left}
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
