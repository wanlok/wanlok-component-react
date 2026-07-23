import { ReactNode } from "react";
import { Stack, StackProps } from "@mui/material";

export const StyledContainer = ({ isError = false, sx, children }: { isError?: boolean; sx?: StackProps["sx"]; children?: ReactNode }) => (
  <Stack
    sx={{
      backgroundColor: "background.default",
      borderLeftWidth: 4,
      borderLeftStyle: "solid",
      borderLeftColor: isError ? "error.main" : "divider",
      ...sx
    }}
  >
    {children}
  </Stack>
);
