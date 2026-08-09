import { ReactNode, useEffect } from "react";
import { alpha, Stack, useTheme } from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from "@mui/icons-material";
import { iconButtonSx, WButton } from "./WButton";
import { TabItem } from "./WTabs";

const iconSize = 64;
const space = 8;

export const ModalControlGroup = ({
  onPreviousClick,
  onNextClick,
  isFullScreen,
  onFullScreenClick,
  isRightHidden,
  onDetailsClick,
  tabs,
  selectedTab,
  scrollbarWidths = { right: 0, bottom: 0 },
  topLeftChildren
}: {
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  isFullScreen: boolean;
  onFullScreenClick: () => void;
  isRightHidden: boolean;
  onDetailsClick: () => void;
  tabs: TabItem[];
  selectedTab: number;
  scrollbarWidths?: { bottom: number; right: number };
  topLeftChildren?: ReactNode;
}) => {
  const { palette } = useTheme();

  const overlayButtonSx = {
    ...iconButtonSx,
    backgroundColor: alpha(palette.primary.main, 0.9),
    "&:hover": { backgroundColor: palette.primary.main }
  };

  const top = space;
  const bottom = space + scrollbarWidths.bottom;
  const left = space;
  const right = space + scrollbarWidths.right;

  const navigateButtonSx = {
    position: "absolute",
    top: top + 64,
    bottom: bottom + 64,
    width: 56,
    overflow: "hidden",
    color: "white",
    backgroundColor: "transparent",
    "&:hover": { backgroundColor: "transparent" }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      if (event.key === "ArrowLeft") {
        onPreviousClick?.();
      } else if (event.key === "ArrowRight") {
        onNextClick?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onPreviousClick, onNextClick]);

  return (
    <>
      {onPreviousClick && (
        <WButton onClick={onPreviousClick} sx={{ ...navigateButtonSx, left }}>
          <KeyboardArrowLeftIcon sx={{ fontSize: iconSize }} />
        </WButton>
      )}
      {onNextClick && (
        <WButton onClick={onNextClick} sx={{ ...navigateButtonSx, right }}>
          <KeyboardArrowRightIcon sx={{ fontSize: iconSize }} />
        </WButton>
      )}
      {topLeftChildren && <Stack sx={{ position: "absolute", top, left }}>{topLeftChildren}</Stack>}
      <Stack sx={{ position: "absolute", top, right }}>
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <WButton onClick={onFullScreenClick} sx={overlayButtonSx}>
            {isFullScreen ? <FullscreenExitIcon sx={{ fontSize: 30 }} /> : <FullscreenIcon sx={{ fontSize: 30 }} />}
          </WButton>
          <WButton onClick={onDetailsClick} sx={overlayButtonSx}>
            {isRightHidden ? tabs[selectedTab]?.icon : <KeyboardArrowRightIcon sx={{ fontSize: 32 }} />}
          </WButton>
        </Stack>
      </Stack>
    </>
  );
};
