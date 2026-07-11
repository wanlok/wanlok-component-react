import { useEffect, useRef, useState } from "react";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";
import { Message } from "../services/Types";
import { WModalContent } from "./WModal";
import { iconButtonSx, WButton } from "./WButton";
import { WText } from "./WText";
import { TextInput } from "./TextInput";
import { StyledContainer } from "./StyledContainer";
import { getDisplayDateTimeString } from "../common/DateUtils";
import { bottomSx } from "./LayoutHeader";

export const Discussion = ({
  messages,
  onAddMessage,
  onDeleteMessage
}: {
  messages: Message[];
  onAddMessage: (name: string, text: string) => void;
  onDeleteMessage: (messageIndex: number) => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [isDeletingMessages, setIsDeletingMessages] = useState(false);
  const [name, setName] = useState("");
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollable = stackRef.current?.parentElement;
    if (scrollable) {
      scrollable.scrollTo({ top: scrollable.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <WModalContent
      titleIcon={mobile ? undefined : <ChatIcon sx={{ fontSize: 24 }} />}
      title={mobile ? undefined : `Discussion (${messages.length} ${messages.length === 1 ? "Message" : "Messages"})`}
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
              { icon: <SendIcon sx={{ fontSize: 20 }} />, onClickWithText: (text) => onAddMessage(name, text) }
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
