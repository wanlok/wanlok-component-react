import { Stack } from "@mui/material";
import { WIconButton } from "./WButton";
import LeftWhiteIcon from "../assets/images/icons/left_white.png";
import RightWhiteIcon from "../assets/images/icons/right_white.png";
import CrossWhiteIcon from "../assets/images/icons/cross_white.png";

export const ControlGroup = ({ onDeleteButtonClick }: { onDeleteButtonClick: () => void }) => {
  return (
    <Stack sx={{ flexDirection: "column", gap: "1px", position: "absolute", top: 0, right: 0 }}>
      <WIconButton
        icon={CrossWhiteIcon}
        iconSize={16}
        onClick={onDeleteButtonClick}
        sx={{ backgroundColor: "common.black" }}
      />
      <WIconButton icon={RightWhiteIcon} iconSize={16} onClick={() => {}} sx={{ backgroundColor: "common.black" }} />
      <WIconButton icon={LeftWhiteIcon} iconSize={16} onClick={() => {}} sx={{ backgroundColor: "common.black" }} />
    </Stack>
  );
};
