import { alpha, CircularProgress, Stack, useTheme } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { iconButtonSx, WButton } from "./WButton";
import { ModalControlGroup } from "./ModalControlGroup";
import { PageItem } from "./WModal";
import { SelectInput } from "./SelectInput";
import { StyledContainer } from "./StyledContainer";

export const ZOOM_ITEMS = [
  { label: "1x", value: "1" },
  { label: "2x", value: "2" },
  { label: "3x", value: "3" },
  { label: "4x", value: "4" }
];

export const ImageModalTopControlGroup = ({
  onAutoExpandButtonClick,
  isAutoExpanding
}: {
  onAutoExpandButtonClick?: () => void;
  isAutoExpanding?: boolean;
}) => (
  <>
    {onAutoExpandButtonClick && (
      <WButton
        onClick={onAutoExpandButtonClick}
        disabled={isAutoExpanding}
        isActivated={isAutoExpanding}
        sx={iconButtonSx}
      >
        {isAutoExpanding ? (
          <CircularProgress size={24} sx={{ color: "common.white" }} />
        ) : (
          <AutoAwesomeIcon sx={{ fontSize: 24 }} />
        )}
      </WButton>
    )}
  </>
);

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
    "&:hover": { backgroundColor: "primary.main" },
    "&.Mui-disabled": { backgroundColor: alpha(palette.common.black, 0.9) }
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
        (onAddButtonClick || onDeleteButtonClick) && (
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            {onAddButtonClick && (
              <WButton onClick={onAddButtonClick} sx={overlayButtonSx}>
                <AddIcon sx={{ fontSize: 26 }} />
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
      bottomLeftChildren={
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <StyledContainer sx={{ minWidth: 80, p: 1, backgroundColor: alpha(palette.background.default, 0.9) }}>
            <SelectInput items={ZOOM_ITEMS} value={zoom} onChange={onZoomChange} />
          </StyledContainer>
          {onAutoExpandButtonClick && (
            <WButton
              onClick={onAutoExpandButtonClick}
              disabled={isAutoExpanding}
              isActivated={false}
              sx={overlayButtonSx}
            >
              {isAutoExpanding ? (
                <CircularProgress size={24} sx={{ color: "common.white" }} />
              ) : (
                <AutoAwesomeIcon sx={{ fontSize: 24 }} />
              )}
            </WButton>
          )}
        </Stack>
      }
    />
  );
};
