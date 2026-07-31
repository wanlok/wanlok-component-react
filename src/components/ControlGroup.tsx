import { alpha, Box, Stack, useTheme } from "@mui/material";
import { iconButtonSx, WButton } from "./WButton";
import {
  Close as CloseIcon,
  ViewList as ViewListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from "@mui/icons-material";
import { Direction } from "../services/Types";
import GoogleIcon from "../assets/images/icons/google.png";
import BingIcon from "../assets/images/icons/bing.png";

export const ControlGroup = ({
  direction,
  scrollHorizontally,
  searchQuery,
  onDetailsButtonClick,
  onDeleteButtonClick,
  onLeftButtonClick,
  onRightButtonClick
}: {
  direction?: Direction;
  scrollHorizontally: boolean;
  searchQuery?: string;
  onDetailsButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
}) => {
  const { palette } = useTheme();
  const overlaySx = direction !== undefined ? {
    backgroundColor: alpha(palette.common.black, 0.6),
    "&:hover": { backgroundColor: alpha(palette.common.black, 0.6) }
  } : {};
  const iconColor = direction !== undefined ? "common.white" : "inherit";
  return (
    <Stack
      sx={[
        { flexDirection: "column", gap: "1px" },
        direction !== undefined && { position: "absolute", top: 0 },
        direction === Direction.left && { left: 0 },
        direction === Direction.right && { right: 0 }
      ]}
    >
      {searchQuery && (
        <>
          <WButton
            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank")}
            sx={{ ...iconButtonSx, ...overlaySx }}
          >
            <Box component="img" src={GoogleIcon} sx={{ width: 16, height: 16 }} />
          </WButton>
          <WButton
            onClick={() => window.open(`https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank")}
            sx={{ ...iconButtonSx, ...overlaySx }}
          >
            <Box component="img" src={BingIcon} sx={{ width: 20, height: 20 }} />
          </WButton>
        </>
      )}
      {onDetailsButtonClick && (
        <WButton onClick={onDetailsButtonClick} sx={{ ...iconButtonSx, ...overlaySx }}>
          <ViewListIcon sx={{ fontSize: 24, color: iconColor }} />
        </WButton>
      )}
      {onDeleteButtonClick && (
        <WButton onClick={onDeleteButtonClick} sx={{ ...iconButtonSx, ...overlaySx }}>
          <CloseIcon sx={{ fontSize: 24, color: iconColor }} />
        </WButton>
      )}
      {!scrollHorizontally && onLeftButtonClick && (
        <WButton onClick={onLeftButtonClick} sx={{ ...iconButtonSx, ...overlaySx }}>
          <KeyboardArrowUpIcon sx={{ fontSize: 32, color: iconColor }} />
        </WButton>
      )}
      {!scrollHorizontally && onRightButtonClick && (
        <WButton onClick={onRightButtonClick} sx={{ ...iconButtonSx, ...overlaySx }}>
          <KeyboardArrowDownIcon sx={{ fontSize: 32, color: iconColor }} />
        </WButton>
      )}
      {scrollHorizontally && onRightButtonClick && (
        <WButton onClick={onRightButtonClick} sx={{ ...iconButtonSx, ...overlaySx }}>
          <KeyboardArrowRightIcon sx={{ fontSize: 32, color: iconColor }} />
        </WButton>
      )}
      {scrollHorizontally && onLeftButtonClick && (
        <WButton onClick={onLeftButtonClick} sx={{ ...iconButtonSx, ...overlaySx }}>
          <KeyboardArrowLeftIcon sx={{ fontSize: 32, color: iconColor }} />
        </WButton>
      )}
    </Stack>
  );
};
