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
  const [buttonHeight, setButtonHeight] = useState<number>();
  const [sufficientSpaces, setSufficientSpaces] = useState<boolean>(false);
  const sufficientSpacesHeightRef = useRef<number>();

  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const height = entries[0].contentRect.height;
        if (buttonHeight) {
          if (height >= buttonHeight * 2) {
            if (sufficientSpacesHeightRef.current === undefined) {
              setSufficientSpaces(true);
              sufficientSpacesHeightRef.current = height;
            } else if (height < sufficientSpacesHeightRef.current) {
              setSufficientSpaces(false);
              sufficientSpacesHeightRef.current = undefined;
            }
          } else {
            setSufficientSpaces(false);
          }
        } else {
          setButtonHeight(height);
        }
      }
    });
    if (stackRef.current) {
      resizeObserver.observe(stackRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [buttonHeight]);

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
      <Stack sx={{ flexDirection: sufficientSpaces ? "column" : "row", gap: "1px" }}>
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
