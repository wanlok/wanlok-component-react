import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";

export const CollectionHeader = ({ top, bottom }: { top: ReactNode; bottom: ReactNode }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return mobile ? (
    <></>
  ) : (
    <Stack sx={mobile ? {} : { height: 100 }}>
      <Stack sx={{ flex: 1, justifyContent: "center", px: 1, backgroundColor: "background.default" }}>
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>{top}</Stack>
      </Stack>
      <Stack sx={{ flexDirection: "row", gap: 1, backgroundColor: "background.default" }}>{bottom}</Stack>
    </Stack>
  );
};
