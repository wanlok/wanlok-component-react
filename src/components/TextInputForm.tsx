import { Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TextInput } from "./TextInput";
import { WButton } from "./WButton";

const buttonWidth = 80;

export const TextInputForm = ({
  placeholder,
  onSubmitClick
}: {
  placeholder: string;
  onSubmitClick: (text: string) => void;
}) => {
  const [text, setText] = useState<string>("");
  const [buttonHeight, setButtonHeight] = useState<number>(0);

  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stackRef.current) {
      setButtonHeight(stackRef.current.offsetHeight);
    }
  }, []);

  const onClick = async () => {
    if (text && text.trim().length > 0) {
      onSubmitClick(text);
      setText("");
    }
  };

  return (
    <Stack ref={stackRef} sx={{ flexDirection: "row", backgroundColor: "#EEEEEE" }}>
      <Stack sx={{ flex: 1, p: 1 }}>
        <TextInput placeholder={placeholder} value={text} onChange={(value) => setText(value)} hideHelperText={true} />
      </Stack>
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton onClick={onClick} sx={{ width: buttonWidth, height: buttonHeight }}>
          Add
        </WButton>
        <WButton onClick={onClick} sx={{ width: buttonWidth, height: buttonHeight }}>
          Export
        </WButton>
      </Stack>
    </Stack>
  );
};
