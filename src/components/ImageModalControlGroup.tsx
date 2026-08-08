import { alpha, Stack, useTheme } from "@mui/material";
import { ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from "@mui/icons-material";
import { iconButtonSx, WButton } from "./WButton";

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
  onZoomOutClick
}: {
  onZoomInClick: () => void;
  onZoomOutClick: () => void;
}) => {
  const { palette } = useTheme();
  return (
    <Stack sx={{ position: "absolute", flexDirection: "row", top: 8, left: 8, gap: "1px" }}>
      <WButton
        onClick={onZoomInClick}
        sx={{
          ...iconButtonSx,
          backgroundColor: alpha(palette.primary.main, 0.9),
          "&:hover": { backgroundColor: palette.primary.main }
        }}
      >
        <ZoomInIcon sx={{ fontSize: 28 }} />
      </WButton>
      <WButton
        onClick={onZoomOutClick}
        sx={{
          ...iconButtonSx,
          backgroundColor: alpha(palette.primary.main, 0.9),
          "&:hover": { backgroundColor: palette.primary.main }
        }}
      >
        <ZoomOutIcon sx={{ fontSize: 28 }} />
      </WButton>
    </Stack>
  );
};
