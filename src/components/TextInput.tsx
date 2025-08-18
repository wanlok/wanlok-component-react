import { FormControl, FormHelperText, SxProps, TextField, Theme } from "@mui/material";
import { useRef } from "react";

export const TextInput = ({
  placeholder,
  value,
  onChange,
  hideHelperText = false,
  tabAllowed = false,
  inputPropsSx
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hideHelperText?: boolean;
  tabAllowed?: boolean;
  inputPropsSx?: SxProps<Theme>;
}) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleTab = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (!input) return;

    const tabSpaces = "  "; // or "\t"
    const start = input.selectionStart!;
    const end = input.selectionEnd!;
    const valueBefore = input.value;
    if (event.key === "Tab") {
      event.preventDefault();

      if (event.shiftKey) {
        const lineStart = valueBefore.lastIndexOf("\n", start - 1) + 1;
        const hasIndent = valueBefore.startsWith(tabSpaces, lineStart);

        if (hasIndent) {
          const newStart = start - tabSpaces.length;
          const newEnd = end - tabSpaces.length;

          input.setRangeText("", lineStart, lineStart + tabSpaces.length, "start");

          onChange(input.value);

          requestAnimationFrame(() => {
            input.selectionStart = newStart;
            input.selectionEnd = newEnd;
          });
        }
      } else {
        input.setRangeText(tabSpaces, start, end, "end");
        onChange(input.value);

        requestAnimationFrame(() => {
          input.selectionStart = input.selectionEnd = start + tabSpaces.length;
        });
      }
    }
  };

  return (
    <FormControl>
      <TextField
        inputRef={inputRef}
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
        onKeyDown={(event) => {
          if (tabAllowed) {
            handleTab(event);
          }
          //   if (event.key === "Enter" && !event.shiftKey) {
          //     event.preventDefault();
          //     submit();
          //   }
        }}
        sx={{
          "& .MuiInputBase-root": {
            p: 0
          },
          "& textarea": {
            p: 1,
            fontSize: 14
          }
        }}
      />
      {!hideHelperText && <FormHelperText sx={{ mt: 1 }}>Shift + Enter for multiple lines</FormHelperText>}
    </FormControl>
  );
};
