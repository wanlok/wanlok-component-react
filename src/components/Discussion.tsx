import { RefObject } from "react";
import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon, Refresh as RefreshIcon, Send as SendIcon } from "@mui/icons-material";
import { Message } from "../services/Types";
import { iconButtonSx, WButton } from "./WButton";
import { TextInputWithButtons } from "./TextInputWithButtons";
import { getDisplayDateTimeString } from "../common/DateUtils";
import { StyledContainer } from "./StyledContainer";
import { EmptyPlaceholder } from "./EmptyPlaceholder";

const MessageRow = ({
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
        <Typography variant="body2">{getDisplayDateTimeString(new Date(message.createdAt))}</Typography>
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

export const DiscussionTop = ({
  name,
  onNameChange,
  onRefresh,
  isDeletingMessages,
  onToggleDeleteMessages
}: {
  name: string;
  onNameChange: (name: string) => void;
  onRefresh: () => void;
  isDeletingMessages: boolean;
  onToggleDeleteMessages: () => void;
}) => (
  <StyledContainer sx={{ flex: 1 }}>
    <TextInputWithButtons
      placeholder="Name"
      initialValue={name}
      onChange={onNameChange}
      rightButtons={[
        { icon: <RefreshIcon sx={{ fontSize: 24 }} />, onClick: onRefresh },
        { icon: <CloseIcon sx={{ fontSize: 24 }} />, isActivated: isDeletingMessages, onClick: onToggleDeleteMessages }
      ]}
    />
  </StyledContainer>
);

export const DiscussionBottom = ({
  onSendMessage,
  onClose
}: {
  onSendMessage: (text: string) => void;
  onClose?: () => void;
}) => (
  <StyledContainer sx={{ flex: 1 }}>
    <TextInputWithButtons
      placeholder="Add a message"
      rightButtons={[
        { icon: <SendIcon sx={{ fontSize: 20 }} />, onClickWithText: onSendMessage },
        ...(onClose ? [{ icon: <CloseIcon sx={{ fontSize: 24 }} />, onClick: onClose }] : [])
      ]}
    />
  </StyledContainer>
);

export const DiscussionMessages = ({
  messages,
  isDeletingMessages,
  onDeleteMessage,
  stackRef
}: {
  messages: Message[];
  isDeletingMessages: boolean;
  onDeleteMessage: (index: number) => void;
  stackRef: RefObject<HTMLDivElement | null>;
}) => (
  <Stack
    ref={stackRef}
    sx={{ flex: messages.length === 0 ? 1 : undefined, backgroundColor: "background.default", gap: 0.5 }}
  >
    {messages.length === 0 ? (
      <EmptyPlaceholder text={"No Discussion"} />
    ) : (
      messages.map((message, i) => (
        <MessageRow
          key={i}
          message={message}
          isDeletingMessages={isDeletingMessages}
          onDeleteMessage={() => onDeleteMessage(i)}
        />
      ))
    )}
  </Stack>
);
