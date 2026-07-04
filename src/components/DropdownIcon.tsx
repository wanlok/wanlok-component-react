import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from "@mui/icons-material";
import { Stack } from "@mui/material";

const iconSize = 40;

export const DropdownIcon = ({ panelOpened }: { panelOpened: boolean }) => {
  return (
    <Stack sx={{ justifyContent: "center", pr: 0.5 }}>
      {panelOpened ? (
        <KeyboardArrowUpIcon sx={{ fontSize: iconSize }} />
      ) : (
        <KeyboardArrowDownIcon sx={{ fontSize: iconSize }} />
      )}
    </Stack>
  );
};
