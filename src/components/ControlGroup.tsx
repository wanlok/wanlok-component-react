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
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  direction: Direction;
  scrollHorizontally: boolean;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
}) => {
  const { breakpoints, palette } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack
      sx={[
        { flexDirection: "column", gap: "1px", position: "absolute", top: 0 },
        direction === Direction.left ? { left: 0 } : { right: 0 }
      ]}
    >
      {onDeleteButtonClick && (
        <WIconButton
          icon={CrossWhiteIcon}
          iconSize={16}
          onClick={onDeleteButtonClick}
          sx={{ backgroundColor: alpha(palette.common.black, 0.6) }}
        />
      )}
      {!scrollHorizontally && mobile && onLeftButtonClick && (
        <WIconButton
          icon={UpWhiteIcon}
          iconSize={16}
          onClick={onLeftButtonClick}
          sx={{ backgroundColor: alpha(palette.common.black, 0.6) }}
        />
      )}
      {!scrollHorizontally && mobile && onRightButtonClick && (
        <WIconButton
          icon={DownWhiteIcon}
          iconSize={16}
          onClick={onRightButtonClick}
          sx={{ backgroundColor: alpha(palette.common.black, 0.6) }}
        />
      )}
      {(scrollHorizontally || !mobile) && onRightButtonClick && (
        <WIconButton
          icon={RightWhiteIcon}
          iconSize={16}
          onClick={onRightButtonClick}
          sx={{ backgroundColor: alpha(palette.common.black, 0.6) }}
        />
      )}
      {(scrollHorizontally || !mobile) && onLeftButtonClick && (
        <WIconButton
          icon={LeftWhiteIcon}
          iconSize={16}
          onClick={onLeftButtonClick}
          sx={{ backgroundColor: alpha(palette.common.black, 0.6) }}
        />
      )}
    </Stack>
  );
};
