import { alpha, Stack, useMediaQuery, useTheme } from "@mui/material";
import { WIconButton } from "./WButton";
import {
  Close as CloseIcon,
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
  const sx = { backgroundColor: alpha(palette.common.black, 0.6) };
  return (
    <Stack
      sx={[
        { flexDirection: "column", gap: "1px", position: "absolute", top: 0 },
        direction === Direction.left ? { left: 0 } : { right: 0 }
      ]}
    >
      {onDetailsButtonClick && <WIconButton icon={""} iconSize={16} onClick={onDetailsButtonClick} sx={sx} />}
      {onDeleteButtonClick && (
        <WIconButton
          icon={<CloseIcon sx={{ color: "common.white" }} />}
          iconSize={16}
          onClick={onDeleteButtonClick}
          sx={sx}
        />
      )}
      {!scrollHorizontally && mobile && onLeftButtonClick && (
        <WIconButton icon={<KeyboardArrowUpIcon sx={{ color: "white" }} />} iconSize={16} onClick={onLeftButtonClick} sx={sx} />
      )}
      {!scrollHorizontally && mobile && onRightButtonClick && (
        <WIconButton icon={<KeyboardArrowDownIcon sx={{ color: "white" }} />} iconSize={16} onClick={onRightButtonClick} sx={sx} />
      )}
      {(scrollHorizontally || !mobile) && onRightButtonClick && (
        <WIconButton icon={<KeyboardArrowRightIcon sx={{ color: "white" }} />} iconSize={16} onClick={onRightButtonClick} sx={sx} />
      )}
      {(scrollHorizontally || !mobile) && onLeftButtonClick && (
        <WIconButton icon={<KeyboardArrowLeftIcon sx={{ color: "white" }} />} iconSize={16} onClick={onLeftButtonClick} sx={sx} />
      )}
    </Stack>
  );
};
