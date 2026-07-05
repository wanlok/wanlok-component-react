import { Button, ButtonOwnProps, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export const height = 40;
export const iconButtonSx = {
  width: 55,
  height: 55,
  p: 0,
  background: "transparent"
};

export const WButton = ({
  children,
  color = "primary",
  className,
  sx,
  onClick,
  leftIcon,
  rightIcon
}: {
  children?: ReactNode;
  color?: ButtonOwnProps["color"];
  className?: string;
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
      className={className}
      sx={{
        minWidth: 0,
        textTransform: "none",
        borderRadius: 0,
        fontSize: 16,
        whiteSpace: "nowrap",
        py: 0,
        pl: leftIcon ? 1 : 2,
        pr: rightIcon ? 1 : 2,
        gap: 0.5,
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
