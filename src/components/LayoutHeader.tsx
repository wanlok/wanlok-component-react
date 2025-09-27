import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";

export const topSx = { flexDirection: "row", gap: 1, alignItems: "center", height: 52 };

export const LayoutHeader = ({ top, bottom }: { top: ReactNode; bottom: ReactNode }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return mobile ? (
    <></>
  ) : (
    <Stack sx={[{ backgroundColor: "background.default" }, mobile ? {} : { height: 100 }]}>
      {top}
      {bottom}
    </Stack>
  );
};
