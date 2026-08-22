import { alpha, CircularProgress, Stack, useTheme } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { iconButtonSx, WButton } from "./WButton";
import { ModalControlGroup } from "./ModalControlGroup";
import { PageItem } from "./WModal";
import { SelectInput } from "./SelectInput";
import { StyledContainer } from "./StyledContainer";
import { ZOOM_ITEMS } from "./ZoomPanImage";

export const ImageModalControlGroup = ({
  onAddButtonClick,
  onAutoExpandButtonClick,
  isAutoExpanding,
  onDeleteButtonClick,
  zoom,
  onZoomChange,
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
  onAddButtonClick?: () => void;
  onAutoExpandButtonClick?: () => void;
  isAutoExpanding?: boolean;
  onDeleteButtonClick?: () => void;
  zoom: string;
  onZoomChange: (value: string) => void;
  isFullScreen: boolean;
  onFullScreenClick: () => void;
  isRightHidden: boolean;
  onDetailsClick: () => void;
  pages: PageItem[];
  selectedPage: number;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  scrollbarWidths?: { right: number; bottom: number };
}) => {
  const { palette } = useTheme();

  const overlayButtonSx = {
    ...iconButtonSx,
    backgroundColor: alpha(palette.primary.main, 0.9),
    "&:hover": { backgroundColor: "primary.main" }
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
        (onAddButtonClick || onAutoExpandButtonClick || onDeleteButtonClick) && (
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            {onAddButtonClick && (
              <WButton onClick={onAddButtonClick} sx={overlayButtonSx}>
                <AddIcon sx={{ fontSize: 26 }} />
              </WButton>
            )}
            {onAutoExpandButtonClick && (
              <WButton
                onClick={onAutoExpandButtonClick}
                disabled={isAutoExpanding}
                isActivated={isAutoExpanding}
                sx={overlayButtonSx}
              >
                {isAutoExpanding ? (
                  <CircularProgress size={24} sx={{ color: "common.white" }} />
                ) : (
                  <AutoAwesomeIcon sx={{ fontSize: 24 }} />
                )}
              </WButton>
            )}
            {onDeleteButtonClick && (
              <WButton onClick={onDeleteButtonClick} sx={overlayButtonSx}>
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            )}
          </Stack>
        )
      }
      bottomRightChildren={
        <StyledContainer
          sx={{
            minWidth: 80,
            p: 1,
            backgroundColor: alpha(palette.background.default, 0.9),
            borderLeft: 0
          }}
        >
          <SelectInput items={ZOOM_ITEMS} value={zoom} onChange={onZoomChange} />
        </StyledContainer>
      }
    />
  );
};
