import { ReactNode } from "react";
import { Stack, Typography } from "@mui/material";

export const EmptyPlaceholder = ({ icon, text = "Empty" }: { icon?: ReactNode; text?: string }) => (
  <Stack
    sx={{
      flex: 1,
      gap: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "common.white"
    }}
  >
    {icon}
    <Typography variant="body2" sx={{ color: "text.disabled" }}>
      {text}
    </Typography>
  </Stack>
);
