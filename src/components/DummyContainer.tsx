import { Divider, Stack, SxProps, Theme, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";

export const DummyContainer = ({ sx, children }: { sx?: SxProps<Theme>; children?: ReactNode }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack
      sx={{
        flexDirection: mobile ? "column" : "row",
        ...sx
      }}
    >
      {children}
      <Divider orientation={mobile ? "horizontal" : "vertical"} />
    </Stack>
  );
};
