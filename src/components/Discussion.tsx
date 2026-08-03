import { RefObject } from "react";
import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon, Refresh as RefreshIcon, Send as SendIcon } from "@mui/icons-material";
import { Message } from "../services/Types";
import { iconButtonSx, WButton } from "./WButton";
import { TextInputWithButtons } from "./TextInputWithButtons";
import { getDisplayDateTimeString } from "../common/DateUtils";
import { StyledContainer } from "./StyledContainer";

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
  onToggleDeleteMessages
}: {
  name: string;
  onNameChange: (name: string) => void;
  onRefresh: () => void;
  onToggleDeleteMessages: () => void;
}) => (
  <StyledContainer sx={{ flex: 1 }}>
    <TextInputWithButtons
      placeholder="Name"
      initialValue={name}
      onChange={onNameChange}
      rightButtons={[
        { icon: <RefreshIcon sx={{ fontSize: 24 }} />, onClick: onRefresh },
        { icon: <CloseIcon sx={{ fontSize: 24 }} />, title: "Delete", onClick: onToggleDeleteMessages }
      ]}
    />
  </StyledContainer>
);

export const DiscussionBottom = ({ onSendMessage }: { onSendMessage: (text: string) => void }) => (
  <StyledContainer sx={{ flex: 1 }}>
    <TextInputWithButtons
      placeholder="Add a message"
      rightButtons={[{ icon: <SendIcon sx={{ fontSize: 20 }} />, onClickWithText: onSendMessage }]}
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
  stackRef: RefObject<HTMLDivElement>;
}) => (
  <Stack ref={stackRef} sx={{ backgroundColor: "background.default", gap: 0.5 }}>
    {messages.length === 0 ? (
      <Stack sx={{ p: 2, backgroundColor: "common.white" }}>
        <Typography variant="body1" sx={{ color: "text.disabled" }}>
          No messages
        </Typography>
      </Stack>
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

