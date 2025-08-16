import { MenuItem, Select, Theme } from "@mui/material";

interface Item {
  label: string;
  value: string;
}

export interface SelectInputProps {
  items: Item[];
  value: string;
  onChange: (value: string) => void;
}

export const SelectInput = ({ items, value, onChange }: SelectInputProps) => {
  return (
    <Select
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      displayEmpty
      inputProps={{
        "aria-label": "Without label"
      }}
      sx={(theme: Theme) => ({
        backgroundColor: theme.palette.common.white,
        borderRadius: 0
      })}
    >
      {items.map((item, index) => {
        return (
          <MenuItem key={`item-${index}`} value={item.value}>
            {item.label}
          </MenuItem>
        );
      })}
    </Select>
  );
};
