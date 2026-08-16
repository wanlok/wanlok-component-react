import { alpha, Stack, useTheme } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from "@mui/icons-material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { iconButtonSx, WButton } from "./WButton";
import { ModalControlGroup } from "./ModalControlGroup";
import { PageItem } from "./WModal";

export const ImageModalTopControlGroup = ({
  onAutoExpandButtonClick,
  isAutoExpanding,
  onZoomInClick,
  onZoomOutClick
}: {
  onAutoExpandButtonClick?: () => void;
  isAutoExpanding?: boolean;
  onZoomInClick: () => void;
  onZoomOutClick: () => void;
}) => (
  <>
    {onAutoExpandButtonClick && (
      <WButton onClick={onAutoExpandButtonClick} disabled={isAutoExpanding} sx={iconButtonSx}>
        <AutoAwesomeIcon sx={{ fontSize: 24 }} />
      </WButton>
    )}
    <WButton onClick={onZoomInClick} sx={iconButtonSx}>
      <ZoomInIcon sx={{ fontSize: 24 }} />
    </WButton>
    <WButton onClick={onZoomOutClick} sx={iconButtonSx}>
      <ZoomOutIcon sx={{ fontSize: 24 }} />
    </WButton>
  </>
);

export const ImageModalControlGroup = ({
  onAddButtonClick,
  onAutoExpandButtonClick,
  isAutoExpanding,
  onDeleteButtonClick,
  onZoomInClick,
  onZoomOutClick,
  isFullScreen,
  onFullScreenClick,
  isRightHidden,
  onDetailsClick,
  pages,
  selectedPage,
  onPreviousClick,
  onNextClick,
  scrollbarWidths
}: {
  onAddButtonClick: () => void;
  onAutoExpandButtonClick?: () => void;
  isAutoExpanding?: boolean;
  onDeleteButtonClick: () => void;
  onZoomInClick: () => void;
  onZoomOutClick: () => void;
  isFullScreen: boolean;
  onFullScreenClick: () => void;
  isRightHidden: boolean;
  onDetailsClick: () => void;
  pages: PageItem[];
  selectedPage: number;
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
      pages={pages}
      selectedPage={selectedPage}
      scrollbarWidths={scrollbarWidths}
      topLeftChildren={
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <WButton onClick={onAddButtonClick} sx={overlayButtonSx}>
            <AddIcon sx={{ fontSize: 26 }} />
          </WButton>
          <WButton onClick={onDeleteButtonClick} sx={overlayButtonSx}>
            <CloseIcon sx={{ fontSize: 24 }} />
          </WButton>
        </Stack>
      }
      bottomLeftChildren={
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          {onAutoExpandButtonClick && (
            <WButton onClick={onAutoExpandButtonClick} disabled={isAutoExpanding} sx={overlayButtonSx}>
              <AutoAwesomeIcon sx={{ fontSize: 26 }} />
            </WButton>
          )}
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
