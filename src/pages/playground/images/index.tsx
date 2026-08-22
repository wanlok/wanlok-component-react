import { useState } from "react";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { ZoomPanImage } from "../../../components/ZoomPanImage";
import { SelectInput } from "../../../components/SelectInput";
import { StyledContainer } from "../../../components/StyledContainer";

const ZOOM_ITEMS = [
  { label: "1x", value: "1" },
  { label: "2x", value: "2" },
  { label: "3x", value: "3" },
  { label: "4x", value: "4" }
];

export const Images = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [zoom, setZoom] = useState("1");

  return (
    <Stack sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
      <LayoutHeader
        top={
          <Stack sx={[topSx, { flex: 1, px: 2, alignItems: "center" }]}>
            <Typography variant="body1">Images</Typography>
          </Stack>
        }
        bottom={
          <Stack sx={[bottomSx]}>
            <StyledContainer sx={{ flex: 1, p: 1 }}>
              <SelectInput items={ZOOM_ITEMS} value={zoom} onChange={setZoom} />
            </StyledContainer>
          </Stack>
        }
      />
      {/* {mobile && (
        <Stack sx={{ flexDirection: "row" }}>
        </Stack>
      )} */}
      <ZoomPanImage src="/images/test.jpg" alt="Test" scale={Number(zoom)} sx={{ backgroundColor: "black" }} />
    </Stack>
  );
};
