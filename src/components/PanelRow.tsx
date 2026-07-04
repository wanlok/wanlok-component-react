import { ReactNode } from "react";
import { Stack } from "@mui/material";

export const PanelRow = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => {
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <Stack sx={{ p: 2 }}>{icon}</Stack>
      <Stack sx={{ flex: 1, gap: 1, py: 2, pr: 2 }}>{children}</Stack>
    </Stack>
  );
};
