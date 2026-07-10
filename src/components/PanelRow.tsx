import { ReactNode } from "react";
import { Stack } from "@mui/material";
import { OneLineTypography } from "./OneLineTypography";

export const PanelRow = ({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) => {
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <Stack sx={{ p: 2 }}>{icon}</Stack>
      <Stack sx={{ flex: 1, gap: 1, py: 2, pr: 2 }}>
        <OneLineTypography variant="body1">{title}</OneLineTypography>
        {children}
      </Stack>
    </Stack>
  );
};
