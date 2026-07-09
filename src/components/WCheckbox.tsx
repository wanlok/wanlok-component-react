import { Checkbox } from "@mui/material";

export const WCheckbox = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => {
  return (
    <Checkbox
      sx={{
        p: 0,
        color: "divider",
        "& .MuiSvgIcon-root": { fontSize: 24 },
        "&.Mui-checked": { color: "common.black" }
      }}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  );
};
