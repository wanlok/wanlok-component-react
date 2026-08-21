import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";

export const Images = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <LayoutHeader
        top={
          <Stack sx={[topSx, { flex: 1, px: 2, alignItems: "center" }]}>
            <Typography variant="body1">Images</Typography>
          </Stack>
        }
        bottom={
          <Stack sx={[bottomSx]}>
            <Typography>Dummy</Typography>
          </Stack>
        }
      />
      {/* {mobile && (
        <Stack sx={{ flexDirection: "row" }}>
        </Stack>
      )} */}
      <Box component="img" src="/images/test.jpg" alt="Test" sx={{ display: "block", maxWidth: "100%" }} />
    </Stack>
  );
};
