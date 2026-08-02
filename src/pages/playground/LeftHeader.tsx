import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";

const Top = () => (
  <Stack sx={[topSx, { px: 2, alignItems: "center" }]}>
    <Typography variant="body1">Playground</Typography>
  </Stack>
);

export const LeftHeader = () => <LayoutHeader top={<Top />} bottom={<></>} />;
