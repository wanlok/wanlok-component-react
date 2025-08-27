import { Chip, SxProps, Theme } from "@mui/material";

export const WChip = ({ icon, label, sx }: { icon: string; label: string; sx?: SxProps<Theme> }) => {
  return (
    <Chip
      variant="outlined"
      label={label}
      icon={<img src={icon} alt="icon" style={{ width: 16, height: 16 }} />}
      sx={{ borderRadius: 0, gap: "4px", pl: "6px", fontSize: 14, ...sx }}
    />
  );
};
