import { Button, ButtonOwnProps, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export const iconButtonSx = {
  width: 55,
  height: 55,
  p: 0
};

export const WButton = ({
  children,
  color = "primary",
  className,
  disabled,
  sx,
  onClick,
  leftIcon,
  rightIcon
}: {
  children?: ReactNode;
  color?: ButtonOwnProps["color"];
  className?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}) => {
  return (
    <Button
      color={color}
      variant="contained"
      disableElevation
      fullWidth={false}
      disabled={disabled}
      className={className}
      sx={{
        minWidth: 0,
        textTransform: "none",
        borderRadius: 0,
        fontSize: 16,
        whiteSpace: "nowrap",
        py: 0,
        px: 2,
        gap: 1,
        ...sx
      }}
      onClick={onClick}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Button>
  );
};
