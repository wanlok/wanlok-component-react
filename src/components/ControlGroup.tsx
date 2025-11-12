import { alpha, Stack, useMediaQuery, useTheme } from "@mui/material";
import { WIconButton } from "./WButton";
import UpWhiteIcon from "../assets/images/icons/up_white.png";
import DownWhiteIcon from "../assets/images/icons/down_white.png";
import LeftWhiteIcon from "../assets/images/icons/left_white.png";
import RightWhiteIcon from "../assets/images/icons/right_white.png";
import CrossWhiteIcon from "../assets/images/icons/cross_white.png";
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
      {onDeleteButtonClick && <WIconButton icon={CrossWhiteIcon} iconSize={16} onClick={onDeleteButtonClick} sx={sx} />}
      {!scrollHorizontally && mobile && onLeftButtonClick && (
        <WIconButton icon={UpWhiteIcon} iconSize={16} onClick={onLeftButtonClick} sx={sx} />
      )}
      {!scrollHorizontally && mobile && onRightButtonClick && (
        <WIconButton icon={DownWhiteIcon} iconSize={16} onClick={onRightButtonClick} sx={sx} />
      )}
      {(scrollHorizontally || !mobile) && onRightButtonClick && (
        <WIconButton icon={RightWhiteIcon} iconSize={16} onClick={onRightButtonClick} sx={sx} />
      )}
      {(scrollHorizontally || !mobile) && onLeftButtonClick && (
        <WIconButton icon={LeftWhiteIcon} iconSize={16} onClick={onLeftButtonClick} sx={sx} />
      )}
    </Stack>
  );
};
