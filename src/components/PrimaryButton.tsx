import { Button, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export const height = 40;

export const PrimaryButton = ({
  children,
  fullWidth,
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
      fullWidth={fullWidth ?? true}
      sx={
        sx ?? {
          height: height,
          textTransform: "none",
          borderRadius: 0
        }
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
