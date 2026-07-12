import { ReactElement, useEffect, useRef, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";
import { Message } from "../services/Types";
import { WModalContent } from "./WModal";
import { iconButtonSx, WButton } from "./WButton";
import { WText } from "./WText";
import { TextInput } from "./TextInput";
import { StyledContainer } from "./StyledContainer";
import { getDisplayDateTimeString } from "../common/DateUtils";
import { bottomSx } from "./LayoutHeader";

export const Discussion = ({
  titleIcon,
  title,
  messages,
  onAddMessage,
  onDeleteMessage
}: {
  titleIcon?: ReactElement;
  title?: string;
  messages: Message[];
  onAddMessage: (name: string, text: string) => void;
  onDeleteMessage: (messageIndex: number) => void;
}) => {
  const [isDeletingMessages, setIsDeletingMessages] = useState(false);
  const [name, setName] = useState("");
  const stackRef = useRef<HTMLDivElement>(null);
  const numberOfMessagesRef = useRef(messages.length);

  useEffect(() => {
    const scrollable = stackRef.current?.parentElement;
    if (scrollable && messages.length > numberOfMessagesRef.current) {
      scrollable.scrollTo({ top: scrollable.scrollHeight, behavior: "smooth" });
    }
    numberOfMessagesRef.current = messages.length;
  }, [messages.length]);

  return (
    <WModalContent
      titleIcon={titleIcon}
      title={title}
      top={
        <Stack sx={[bottomSx, { flex: 1, gap: "1px" }]}>
          <StyledContainer sx={{ flex: 1, p: 1 }}>
            <TextInput placeholder="Your name" value={name} onChange={setName} hideHelperText={true} />
          </StyledContainer>
          <WButton
            onClick={() => setIsDeletingMessages(!isDeletingMessages)}
            rightIcon={<CloseIcon sx={{ fontSize: 24 }} />}
          >
            Delete
          </WButton>
        </Stack>
      }
      bottom={
        <StyledContainer sx={{ flex: 1 }}>
          <WText
            placeholder="Add a message"
            rightButtons={[
              {
                icon: <SendIcon sx={{ fontSize: 20 }} />,
                onClickWithText: (text) => {
                  setIsDeletingMessages(false);
                  onAddMessage(name, text);
                }
              }
            ]}
          />
        </StyledContainer>
      }
    >
      <Stack ref={stackRef} sx={{ gap: 1 }}>
        {messages.length === 0 ? (
          <Typography variant="body1" sx={{ color: "text.disabled" }}>
            No messages
          </Typography>
        ) : (
          messages.map((message, i) => (
            <StyledContainer key={i} sx={{ flexDirection: "row" }}>
              <Stack sx={{ flex: 1, p: 2 }}>
                <Typography variant="body2">{message.name}</Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                  {message.text}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {getDisplayDateTimeString(new Date(message.created_at))}
                </Typography>
              </Stack>
              <Stack>
                {isDeletingMessages && (
                  <WButton onClick={() => onDeleteMessage(i)} sx={iconButtonSx}>
                    <CloseIcon sx={{ fontSize: 24 }} />
                  </WButton>
                )}
              </Stack>
            </StyledContainer>
          ))
        )}
      </Stack>
    </WModalContent>
  );
};
