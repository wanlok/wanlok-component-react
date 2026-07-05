import { Stack } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

import { TextInput } from "./TextInput";
import { WButton } from "./WButton";

interface ButtonContent {
  leftIcon?: ReactNode;
  text: string;
  onClickWithText?: (text: string) => void;
  onClick?: () => void;
}

export const WText = ({
  placeholder,
  rightButtons
}: {
  placeholder?: string;
  rightButtons: ButtonContent[];
}) => {
  const [value, setValue] = useState("");
  const [buttonHeight, setButtonHeight] = useState<number>();
  const [sufficientSpaces, setSufficientSpaces] = useState<boolean>(false);
  const sufficientSpacesHeightRef = useRef<number>();

  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;
      if (buttonHeight) {
        if (height >= buttonHeight * rightButtons.length) {
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
    });
    if (stackRef.current) {
      resizeObserver.observe(stackRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [buttonHeight, rightButtons.length]);

  const getText = (onClick: (text: string) => void) => {
    if (value && value.trim().length > 0) {
      onClick(value);
      setValue("");
    }
  };

  return (
    <Stack ref={stackRef} sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
      <Stack sx={{ flex: 1, p: 1 }}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChange={(changedText) => setValue(changedText)}
          hideHelperText={true}
        />
      </Stack>
      <Stack sx={{ flexDirection: sufficientSpaces ? "column" : "row", gap: "1px" }}>
        {rightButtons.map(({ leftIcon, text, onClick, onClickWithText }, index) => (
          <WButton
            sx={{ height: buttonHeight }}
            key={`right-button-${index}`}
            leftIcon={leftIcon}
            onClick={() => {
              onClick && onClick();
              onClickWithText && getText(onClickWithText);
            }}
          >
            {text}
          </WButton>
        ))}
      </Stack>
    </Stack>
  );
};
