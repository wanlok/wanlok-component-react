import { FormControl, FormHelperText, SxProps, TextField, Theme } from "@mui/material";

export const TextInput = ({
  placeholder,
  value,
  onChange,
  inputPropsSx
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
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
      <FormHelperText sx={{ mt: 1 }}>Shift + Enter for multiple lines</FormHelperText>
    </FormControl>
  );
};
