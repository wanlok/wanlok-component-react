import { ReactElement, useEffect, useRef, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon, Refresh as RefreshIcon, Send as SendIcon } from "@mui/icons-material";
import { Message } from "../services/Types";
import { WModalContent } from "./WModal";
import { iconButtonSx, WButton } from "./WButton";
import { WText } from "./WText";
import { StyledContainer } from "./StyledContainer";
import { getDisplayDateTimeString } from "../common/DateUtils";

export const Row = ({
  message,
  isDeletingMessages,
  onDeleteMessage
}: {
  message: Message;
  isDeletingMessages: boolean;
  onDeleteMessage: () => void;
}) => (
  <Stack sx={{ flexDirection: "row", backgroundColor: "common.white" }}>
    <Stack sx={{ flex: 1, p: 2, gap: 1 }}>
      <Stack sx={{ flexDirection: "row" }}>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {message.name}
        </Typography>
        <Typography variant="body2">{getDisplayDateTimeString(new Date(message.created_at))}</Typography>
      </Stack>
      <Typography variant="body1" sx={{ flex: 1, whiteSpace: "pre-wrap" }}>
        {message.text}
      </Typography>
    </Stack>
    {isDeletingMessages && (
      <Stack>
        <WButton onClick={onDeleteMessage} sx={iconButtonSx}>
          <CloseIcon sx={{ fontSize: 24 }} />
        </WButton>
      </Stack>
    )}
  </Stack>
);

export const Discussion = ({
  titleIcon,
  title,
  messages,
  onRefresh,
  onAddMessage,
  onDeleteMessage
}: {
  titleIcon?: ReactElement;
  title?: string;
  messages: Message[];
  onRefresh: () => void;
  onAddMessage: (name: string, text: string) => void;
  onDeleteMessage: (messageIndex: number) => void;
}) => {
  const [isDeletingMessages, setIsDeletingMessages] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem("discussion_name") ?? "");
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
        <StyledContainer sx={{ flex: 1 }}>
          <WText
            placeholder="Your name"
            initialValue={name}
            onChange={(value) => {
              setName(value);
              localStorage.setItem("discussion_name", value);
            }}
            rightButtons={[
              {
                icon: <RefreshIcon sx={{ fontSize: 24 }} />,
                onClick: onRefresh
              },
              {
                icon: <CloseIcon sx={{ fontSize: 24 }} />,
                title: "Delete",
                onClick: () => setIsDeletingMessages(!isDeletingMessages)
              }
            ]}
          />
        </StyledContainer>
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
      <Stack ref={stackRef} sx={{ backgroundColor: "background.default", gap: 0.5 }}>
        {messages.length === 0 ? (
          <Stack sx={{ p: 2, backgroundColor: "common.white" }}>
            <Typography variant="body1" sx={{ color: "text.disabled" }}>
              No messages
            </Typography>
          </Stack>
        ) : (
          messages.map((message, i) => (
            <Row
              key={i}
              message={message}
              isDeletingMessages={isDeletingMessages}
              onDeleteMessage={() => onDeleteMessage(i)}
            />
          ))
        )}
      </Stack>
    </WModalContent>
  );
};
