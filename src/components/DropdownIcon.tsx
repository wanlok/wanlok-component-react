import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from "@mui/icons-material";
import { Stack, SxProps, Theme } from "@mui/material";

const iconSize = 40;

export const DropdownIcon = ({ panelOpened, sx }: { panelOpened: boolean; sx?: SxProps<Theme> }) => {
  return (
    <Stack sx={{ justifyContent: "center", pr: 1, ...sx }}>
      {panelOpened ? (
        <KeyboardArrowUpIcon sx={{ fontSize: iconSize }} />
      ) : (
        <KeyboardArrowDownIcon sx={{ fontSize: iconSize }} />
      )}
    </Stack>
  );
};
