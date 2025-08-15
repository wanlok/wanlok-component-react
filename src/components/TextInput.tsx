import { FormControl, FormHelperText, TextField } from "@mui/material";

export const TextInput = ({
  placeholder,
  value,
  onChange
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <FormControl>
      <TextField
        placeholder={placeholder}
        value={value}
        multiline
        InputProps={{
          sx: (theme) => ({
            backgroundColor: theme.palette.common.white,
            borderRadius: 0
          })
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
