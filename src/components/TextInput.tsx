import { useRef } from "react";
import { FormHelperText, SxProps, TextField, Theme } from "@mui/material";

const tabSpaces = "  ";

const handleTab = (
  element: HTMLTextAreaElement | null,
  event: React.KeyboardEvent<HTMLDivElement>,
  onChange: (value: string) => void
) => {
  if (element && event.key === "Tab") {
    event.preventDefault();

    const start = element.selectionStart;
    const end = element.selectionEnd;

    if (event.shiftKey) {
      const lineStart = element.value.lastIndexOf("\n", start - 1) + 1;
      const hasIndent = element.value.startsWith(tabSpaces, lineStart);

      if (hasIndent) {
        const newStart = start - tabSpaces.length;
        const newEnd = end - tabSpaces.length;

        element.setRangeText("", lineStart, lineStart + tabSpaces.length, "start");

        onChange(element.value);

        requestAnimationFrame(() => {
          element.selectionStart = newStart;
          element.selectionEnd = newEnd;
        });
      }
    } else {
      element.setRangeText(tabSpaces, start, end, "end");
      onChange(element.value);

      requestAnimationFrame(() => {
        element.selectionStart = element.selectionEnd = start + tabSpaces.length;
      });
    }
  }
};

export const TextInput = ({
  placeholder,
  value,
  onChange,
  hideHelperText = false,
  tabAllowed = false,
  inputPropsSx
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  hideHelperText?: boolean;
  tabAllowed?: boolean;
  inputPropsSx?: SxProps<Theme>;
}) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <>
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
            handleTab(inputRef.current, event, onChange);
          }
          //   if (event.key === "Enter" && !event.shiftKey) {
          //     event.preventDefault();
          //     submit();
          //   }
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "primary.dark"
            },
            "&:hover fieldset": {
              borderColor: "common.black"
            },
            "&.Mui-focused fieldset": {
              borderWidth: "1px",
              borderColor: "common.black"
            }
          },
          "& .MuiInputBase-root": {
            p: 0
          },
          "& textarea": {
            p: 1,
            fontSize: 16
          }
        }}
      />
      {!hideHelperText && <FormHelperText sx={{ mt: 1 }}>Shift + Enter for multiple lines 1234</FormHelperText>}
    </>
  );
};
