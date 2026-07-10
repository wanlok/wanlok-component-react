import { ReactNode } from "react";
import { Typography, TypographyProps } from "@mui/material";

export const OneLineTypography = ({
  variant,
  sx,
  children
}: {
  variant?: TypographyProps["variant"];
  sx?: object;
  children?: ReactNode;
}) => (
  <Typography
    variant={variant}
    sx={{ overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 1, ...sx }}
  >
    {children}
  </Typography>
);
