import { FormControl, FormHelperText, SxProps, TextField, Theme } from "@mui/material";

export const TextInput = ({
  placeholder,
  value,
  onChange,
  hideHelperText = false,
  inputPropsSx
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hideHelperText?: boolean;
  inputPropsSx?: SxProps<Theme>;
}) => {
  return (
    <FormControl>
      <TextField
        placeholder={placeholder}
        value={value}
        multiline
        InputProps={{
          sx: {
            backgroundColor: "common.white",
            borderRadius: 0,
            ...inputPropsSx
          }
        }}
        onChange={(event) => onChange(event.target.value)}
        // onKeyDown={(event) => {
        //   if (event.key === "Enter" && !event.shiftKey) {
        //     event.preventDefault();
        //     submit();
        //   }
        // }}
      />
      {!hideHelperText && <FormHelperText sx={{ mt: 1 }}>Shift + Enter for multiple lines</FormHelperText>}
    </FormControl>
  );
};
