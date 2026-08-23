import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../../components/LayoutHeader";

export const Index = () => {
  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <LayoutHeader
        top={
          <Stack sx={[topSx, { alignItems: "center", px: 2 }]}>
            <Typography variant="body1">Puzzle</Typography>
          </Stack>
        }
        bottom={<></>}
      />
      <Typography variant="body1">Puzzle</Typography>
    </Stack>
  );
};
