import { Box, Button, ButtonOwnProps, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export const height = 40;

export const WButton = ({
  children,
  color = "primary",
  className,
  sx,
  onClick,
  rightIcon
}: {
  children?: ReactNode;
  color?: ButtonOwnProps["color"];
  className?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
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
        height: height,
        minWidth: 0,
        textTransform: "none",
        borderRadius: 0,
        fontSize: 16,
        whiteSpace: "nowrap",
        px: 2,
        py: 0,
        ...sx
      }}
      onClick={onClick}
      endIcon={rightIcon}
    >
      {children}
    </Button>
  );
};

export const WIconButton = ({
  icon,
  iconSize = 16,
  buttonSize = 48,
  onClick,
  className,
  sx
}: {
  icon: string | ReactNode;
  iconSize?: number;
  buttonSize?: number;
  onClick: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}) => {
  return (
    <WButton
      onClick={onClick}
      className={className}
      sx={{ backgroundColor: "transparent", p: 0, width: buttonSize, height: buttonSize, ...sx }}
    >
      {typeof icon === "string" ? (
        <Box component="img" src={icon} alt="" sx={{ width: iconSize, height: iconSize }} />
      ) : (
        <Box sx={{ fontSize: iconSize, display: "flex", alignItems: "center" }}>{icon}</Box>
      )}
    </WButton>
  );
};
