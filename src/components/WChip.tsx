import { Chip, SxProps, Theme } from "@mui/material";
import { ReactElement, ReactNode } from "react";

export const WChip = ({ icon, label, sx }: { icon: string | ReactNode; label?: string; sx?: SxProps<Theme> }) => {
  return (
    <Chip
      variant="outlined"
      label={label}
      icon={
        typeof icon === "string" ? (
          <img src={icon} alt="icon" style={{ width: 16, height: 16 }} />
        ) : (
          (icon as ReactElement)
        )
      }
      sx={{
        borderRadius: 0,
        pl: 1,
        fontSize: 14,
        "& .MuiChip-label": { pr: 1.8 },
        ...(!label
          ? {
              pr: 1.5,
              "& .MuiChip-icon": { mr: 0 },
              "& .MuiChip-label": { p: 0 }
            }
          : {}),
        ...sx
      }}
    />
  );
};
