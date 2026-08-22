import { Button, ButtonOwnProps, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export const iconButtonSx = {
  width: 56,
  height: 56,
  p: 0
};

export const WButton = ({
  children,
  color = "primary",
  className,
  disabled,
  isActivated,
  sx,
  onClick,
  leftIcon,
  rightIcon
}: {
  children?: ReactNode;
  color?: ButtonOwnProps["color"];
  className?: string;
  disabled?: boolean;
  isActivated?: boolean;
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
        ...(isActivated && {
          backgroundColor: "common.black",
          "&:hover": { backgroundColor: "common.black" },
          color: "common.white",
          // MUI's own .Mui-disabled background/color otherwise wins this specificity race when
          // isActivated and disabled are both true at once (e.g. a loading-state icon button).
          "&.Mui-disabled": { backgroundColor: "common.black", color: "common.white" }
        }),
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
