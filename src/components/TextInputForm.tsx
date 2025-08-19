import { Stack } from "@mui/material";
import { useState } from "react";
import { TextInput } from "./TextInput";
import { WButton } from "./WButton";

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
    <Stack sx={{ flexDirection: "row", backgroundColor: "#EEEEEE" }}>
      <Stack sx={{ flex: 1, p: 1 }}>
        <TextInput placeholder={placeholder} value={text} onChange={(value) => setText(value)} hideHelperText={true} />
      </Stack>
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton onClick={onClick} sx={{ height: "100%" }}>
          Save
        </WButton>{" "}
        <WButton onClick={onClick} sx={{ height: "100%" }}>
          Button 2
        </WButton>
      </Stack>
    </Stack>
  );
};
