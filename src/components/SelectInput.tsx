import { FormControl, FormHelperText, FormLabel, MenuItem, Select, Theme } from "@mui/material";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";

interface Item {
  label: string;
  value: string;
}

export interface SelectInputProps {
  label?: string;
  items: Item[];
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}

const height = 40;

export const SelectInput = ({ label, items, value, onChange, helperText }: SelectInputProps) => {
  return (
    <FormControl>
      {label && (
        <FormLabel focused={false} sx={{ color: "text.secondary", typography: "body2", mb: "4px" }}>
          {label}
        </FormLabel>
      )}
      <Select
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
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
            paddingRight: "32px !important",
            lineHeight: "24px"
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
            fontSize: 32,
            top: "50%",
            right: 4,
            transform: "translateY(-50%)"
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
      {helperText && <FormHelperText sx={{ mt: 0.5, ml: 0, color: "text.secondary" }}>{helperText}</FormHelperText>}
    </FormControl>
  );
};
