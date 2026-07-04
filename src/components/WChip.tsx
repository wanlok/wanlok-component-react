import { Chip, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export const WChip = ({ icon, label, sx }: { icon: string | ReactNode; label: string; sx?: SxProps<Theme> }) => {
  return (
    <Chip
      variant="outlined"
      label={label}
      icon={
        typeof icon === "string" ? (
          <img src={icon} alt="icon" style={{ width: 16, height: 16 }} />
        ) : (
          icon as React.ReactElement
        )
      }
      sx={{ borderRadius: 0, gap: "4px", pl: "6px", fontSize: 14, ...sx }}
    />
  );
};
