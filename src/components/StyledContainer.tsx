import { ReactNode } from "react";
import { Stack, StackProps } from "@mui/material";

export const StyledContainer = ({ sx, children }: { sx?: StackProps["sx"]; children?: ReactNode }) => (
  <Stack
    sx={{
      backgroundColor: "background.default",
      borderLeftWidth: 4,
      borderLeftStyle: "solid",
      borderLeftColor: "divider",
      ...sx
    }}
  >
    {children}
  </Stack>
);
