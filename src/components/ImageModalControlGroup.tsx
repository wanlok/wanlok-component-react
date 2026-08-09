import { alpha, Stack, useTheme } from "@mui/material";
import { ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from "@mui/icons-material";
import { iconButtonSx, WButton } from "./WButton";
import { ModalControlGroup } from "./ModalControlGroup";
import { TabItem } from "./WTabs";

export const ImageModalTopControlGroup = ({
  onZoomInClick,
  onZoomOutClick
}: {
  onZoomInClick: () => void;
  onZoomOutClick: () => void;
}) => (
  <>
    <WButton onClick={onZoomInClick} sx={iconButtonSx}>
      <ZoomInIcon sx={{ fontSize: 24 }} />
    </WButton>
    <WButton onClick={onZoomOutClick} sx={iconButtonSx}>
      <ZoomOutIcon sx={{ fontSize: 24 }} />
    </WButton>
  </>
);

export const ImageModalControlGroup = ({
  onZoomInClick,
  onZoomOutClick,
  isFullScreen,
  onFullScreenClick,
  isRightHidden,
  onDetailsClick,
  tabs,
  selectedTab,
  onPreviousClick,
  onNextClick,
  scrollbarWidths
}: {
  onZoomInClick: () => void;
  onZoomOutClick: () => void;
  isFullScreen: boolean;
  onFullScreenClick: () => void;
  isRightHidden: boolean;
  onDetailsClick: () => void;
  tabs: TabItem[];
  selectedTab: number;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  scrollbarWidths: { right: number; bottom: number };
}) => {
  const { palette } = useTheme();

  const overlayButtonSx = {
    ...iconButtonSx,
    backgroundColor: alpha(palette.primary.main, 0.9),
    "&:hover": { backgroundColor: palette.primary.main }
  };

  return (
    <ModalControlGroup
      onPreviousClick={onPreviousClick}
      onNextClick={onNextClick}
      isFullScreen={isFullScreen}
      onFullScreenClick={onFullScreenClick}
      isRightHidden={isRightHidden}
      onDetailsClick={onDetailsClick}
      tabs={tabs}
      selectedTab={selectedTab}
      scrollbarWidths={scrollbarWidths}
      topLeftChildren={
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <WButton onClick={onZoomInClick} sx={overlayButtonSx}>
            <ZoomInIcon sx={{ fontSize: 28 }} />
          </WButton>
          <WButton onClick={onZoomOutClick} sx={overlayButtonSx}>
            <ZoomOutIcon sx={{ fontSize: 28 }} />
          </WButton>
        </Stack>
      }
    />
  );
};
