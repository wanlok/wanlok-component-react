import { alpha, Stack, useTheme } from "@mui/material";
import { WIconButton } from "./WButton";
import LeftWhiteIcon from "../assets/images/icons/left_white.png";
import RightWhiteIcon from "../assets/images/icons/right_white.png";
import CrossWhiteIcon from "../assets/images/icons/cross_white.png";

export const ControlGroup = ({
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  const theme = useTheme();
  return (
    <Stack sx={{ flexDirection: "column", gap: "1px", position: "absolute", top: 0, right: 0 }}>
      <WIconButton
        icon={CrossWhiteIcon}
        iconSize={16}
        onClick={onDeleteButtonClick}
        sx={{ backgroundColor: alpha(theme.palette.common.black, 0.6) }}
      />
      <WIconButton
        icon={RightWhiteIcon}
        iconSize={16}
        onClick={onLeftButtonClick}
        sx={{ backgroundColor: alpha(theme.palette.common.black, 0.6) }}
      />
      <WIconButton
        icon={LeftWhiteIcon}
        iconSize={16}
        onClick={onRightButtonClick}
        sx={{ backgroundColor: alpha(theme.palette.common.black, 0.6) }}
      />
    </Stack>
  );
};
