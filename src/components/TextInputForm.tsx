import { Stack } from "@mui/material";
import { useState } from "react";
import { TextInput } from "./TextInput";
import { PrimaryButton } from "./PrimaryButton";

export const TextInputForm = ({
  placeholder,
  onSubmitClick
}: {
  placeholder: string;
  onSubmitClick: (text: string) => void;
}) => {
  const [text, setText] = useState<string>("");

  const onClick = async () => {
    if (text && text.trim().length > 0) {
      onSubmitClick(text);
      setText("");
    }
  };

  return (
    <Stack sx={{ flexDirection: "row", gap: 1, p: 1, backgroundColor: "#EEEEEE" }}>
      <Stack sx={{ flex: 1 }}>
        <TextInput placeholder={placeholder} value={text} onChange={(value) => setText(value)} hideHelperText={true} />
      </Stack>
      <Stack sx={{}}>
        <PrimaryButton onClick={onClick}>Save</PrimaryButton>
      </Stack>
    </Stack>
  );
};
