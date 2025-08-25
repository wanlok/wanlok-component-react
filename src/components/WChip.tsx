import { Chip } from "@mui/material";

export const WChip = ({ icon, label }: { icon: string; label: string }) => {
  return (
    <Chip
      variant="outlined"
      label={label}
      icon={<img src={icon} alt="icon" style={{ width: 16, height: 16 }} />}
      sx={{ borderRadius: 0, gap: "4px", pl: "6px", fontSize: 14 }}
    />
  );
};
