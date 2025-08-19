import { Button, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export const height = 40;

export const PrimaryButton = ({
  children,
  fullWidth = false,
  sx,
  onClick
}: {
  children?: ReactNode;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}) => {
  return (
    <Button
      color="primary"
      variant="contained"
      disableElevation
      fullWidth={fullWidth}
      sx={{
        height: height,
        minWidth: 0,
        textTransform: "none",
        borderRadius: 0,
        fontSize: 14,
        whiteSpace: "nowrap",
        px: 2,
        py: 0,
        ...sx
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
