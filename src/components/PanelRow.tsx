import { ReactNode } from "react";
import { Stack, Typography } from "@mui/material";

export const PanelRow = ({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) => {
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <Stack sx={{ p: 2 }}>{icon}</Stack>
      <Stack sx={{ flex: 1, gap: 1, py: 2, pr: 2 }}>
        <Typography
          variant="body1"
          sx={{ overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 1 }}
        >
          {title}
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
};
