import { Stack } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

import { TextInput } from "./TextInput";
import { WButton } from "./WButton";

interface ButtonContent {
  icon: ReactNode;
  title?: string;
  onClickWithText?: (text: string) => void;
  onClick?: () => void;
}

export const TextInputWithButtons = ({
  placeholder,
  initialValue,
  onChange,
  rightButtons
}: {
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  rightButtons: ButtonContent[];
}) => {
  const [value, setValue] = useState(initialValue ?? "");
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
        if (height > 0) {
          setButtonHeight(height);
        }
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
          onChange={(changedText) => {
            setValue(changedText);
            onChange?.(changedText);
          }}
          hideHelperText={true}
        />
      </Stack>
      <Stack sx={{ flexDirection: sufficientSpaces ? "column" : "row", gap: "1px" }}>
        {rightButtons.map(({ icon, title, onClick, onClickWithText }, index) => (
          <WButton
            key={`right-button-${index}`}
            rightIcon={icon}
            sx={{ width: title && !sufficientSpaces ? undefined : buttonHeight, height: buttonHeight, p: title && !sufficientSpaces ? undefined : 0 }}
            onClick={() => {
              onClick && onClick();
              onClickWithText && getText(onClickWithText);
            }}
          >
            {!sufficientSpaces && title}
          </WButton>
        ))}
      </Stack>
    </Stack>
  );
};
