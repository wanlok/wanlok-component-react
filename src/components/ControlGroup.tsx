import { alpha, Stack, useMediaQuery, useTheme } from "@mui/material";
import { iconButtonSx, WButton } from "./WButton";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from "@mui/icons-material";
import { Direction } from "../services/Types";

export const ControlGroup = ({
  direction,
  scrollHorizontally,
  onDetailsButtonClick,
  onDeleteButtonClick,
  onLeftButtonClick,
  onRightButtonClick
}: {
  direction: Direction;
  scrollHorizontally: boolean;
  onDetailsButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
}) => {
  const { breakpoints, palette } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const sx = { ...iconButtonSx, backgroundColor: alpha(palette.common.black, 0.6) };
  return (
    <Stack
      sx={[
        { flexDirection: "column", gap: "1px", position: "absolute", top: 0 },
        direction === Direction.left ? { left: 0 } : { right: 0 }
      ]}
    >
      {onDetailsButtonClick && (
        <WButton onClick={onDetailsButtonClick} sx={sx}>
          <EditIcon sx={{ fontSize: 18, color: "common.white" }} />
        </WButton>
      )}
      {onDeleteButtonClick && (
        <WButton onClick={onDeleteButtonClick} sx={sx}>
          <CloseIcon sx={{ fontSize: 24, color: "common.white" }} />
        </WButton>
      )}
      {!scrollHorizontally && mobile && onLeftButtonClick && (
        <WButton onClick={onLeftButtonClick} sx={sx}>
          <KeyboardArrowUpIcon sx={{ fontSize: 24, color: "common.white" }} />
        </WButton>
      )}
      {!scrollHorizontally && mobile && onRightButtonClick && (
        <WButton onClick={onRightButtonClick} sx={sx}>
          <KeyboardArrowDownIcon sx={{ fontSize: 24, color: "common.white" }} />
        </WButton>
      )}
      {(scrollHorizontally || !mobile) && onRightButtonClick && (
        <WButton onClick={onRightButtonClick} sx={sx}>
          <KeyboardArrowRightIcon sx={{ fontSize: 24, color: "common.white" }} />
        </WButton>
      )}
      {(scrollHorizontally || !mobile) && onLeftButtonClick && (
        <WButton onClick={onLeftButtonClick} sx={sx}>
          <KeyboardArrowLeftIcon sx={{ fontSize: 24, color: "common.white" }} />
        </WButton>
      )}
    </Stack>
  );
};
