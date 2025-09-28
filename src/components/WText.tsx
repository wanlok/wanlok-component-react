import { Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TextInput } from "./TextInput";
import { WButton, WIconButton } from "./WButton";

interface LabelButtonContent {
  label: string;
  onClickWithText?: (text: string) => void;
  onClick?: () => void;
}

interface IconButtonContent {
  icon: string;
  size: number;
  onClickWithText?: (text: string) => void;
  onClick?: () => void;
}

export const WText = ({
  text = "",
  editable = true,
  placeholder,
  rightButtons
}: {
  text?: string;
  editable?: boolean;
  placeholder: string;
  rightButtons: (LabelButtonContent | IconButtonContent)[];
}) => {
  const [value, setValue] = useState<string>(text);
  const [buttonHeight, setButtonHeight] = useState<number>();
  const [sufficientSpaces, setSufficientSpaces] = useState<boolean>(false);
  const sufficientSpacesHeightRef = useRef<number>();

  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(text);
  }, [text]);

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
        {editable ? (
          <TextInput
            placeholder={placeholder}
            value={value}
            onChange={(changedText) => setValue(changedText)}
            hideHelperText={true}
          />
        ) : (
          <Stack sx={{ justifyContent: "center", height: 39 }}>
            <Typography variant="body1">{value}</Typography>
          </Stack>
        )}
      </Stack>
      <Stack sx={{ flexDirection: sufficientSpaces ? "column" : "row", gap: "1px" }}>
        {rightButtons.map((buttonContent, index) => {
          let children;
          if ("label" in buttonContent) {
            const { label, onClick, onClickWithText } = buttonContent;
            children = (
              <WButton
                sx={{ height: buttonHeight }}
                key={`right-button-${index}`}
                onClick={() => {
                  onClick && onClick();
                  onClickWithText && getText(onClickWithText);
                }}
              >
                {label}
              </WButton>
            );
          } else {
            const { icon, size, onClick, onClickWithText } = buttonContent;
            children = (
              <WIconButton
                sx={{ height: buttonHeight, backgroundColor: "primary.main" }}
                key={`right-button-${index}`}
                icon={icon}
                iconSize={size}
                onClick={() => {
                  onClick && onClick();
                  onClickWithText && getText(onClickWithText);
                }}
              />
            );
          }
          return children;
        })}
      </Stack>
    </Stack>
  );
};
