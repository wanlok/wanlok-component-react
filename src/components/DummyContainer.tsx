import { Divider, Stack, SxProps, Theme, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";

export const DummyContainer = ({
  hideDivider = false,
  sx,
  children
}: {
  hideDivider?: boolean;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}) => {
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
      {!hideDivider && <Divider orientation={mobile ? "horizontal" : "vertical"} />}
    </Stack>
  );
};
