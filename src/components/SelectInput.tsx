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

const height = 39;

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
        borderRadius: 0,
        height,
        "& .MuiSelect-select": {
          px: 1,
          py: 0,
          paddingRight: "32px !important"
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "primary.dark"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "common.black"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: "1px",
          borderColor: "common.black"
        },
        "& .MuiSelect-icon": {
          color: "common.black",
          top: 6,
          right: 4
        }
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
