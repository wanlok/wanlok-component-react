import { useEffect, useRef, useState } from "react";
import { Discussion, useDiscussion } from "./useDiscussion";
import { FormControl, FormHelperText, Stack, TextField, Typography } from "@mui/material";
import { WButton } from "../../components/WButton";
import { YouTubePreview } from "../../components/YouTubePreview";

const DiscussionList = ({ discussion }: { discussion: Discussion }) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const { playAudio } = useDiscussion();

  useEffect(() => {
    if (stackRef.current) {
      stackRef.current.scrollTop = stackRef.current.scrollHeight;
    }
    playAudio();
  }, [discussion, playAudio]);

  return (
    <Stack ref={stackRef} sx={{ flex: 1, overflowY: "auto" }}>
      {discussion.messages.map((message, i) => (
        <Stack key={`message-${i}`} sx={{ backgroundColor: "#EEEEEE", mt: i === 0 ? 0 : "1px", p: 2, gap: 1 }}>
          <Stack sx={{ flexDirection: "row" }}>
            <Typography>{message.name}</Typography>
            <Typography sx={{ flex: 1, textAlign: "right" }}>{new Date(message.timestamp).toLocaleString()}</Typography>
          </Stack>
          <Stack>
            {message.lines.split("\n").map((line, j) => (
              <Typography key={`message-${i}-line-${j}`}>{line.length > 0 ? line : <br />}</Typography>
            ))}
            {message.lines.includes("https://www.youtube.com/") && <YouTubePreview message={message} />}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

const DiscussionForm = ({ addMessage }: { addMessage: (name: string, lines: string) => Promise<void> }) => {
  const getName = () => localStorage.getItem("discussion_name") ?? "";
  const [name, setName] = useState<string>(getName());
  const [lines, setLines] = useState<string>("");

  const submit = async () => {
    if (name && lines && lines.trim().length > 0) {
      await addMessage(name, lines);
      localStorage.setItem("discussion_name", name);
      setLines("");
    }
  };

  return (
    <Stack sx={{ flexDirection: "row", gap: 2, p: 2 }}>
      <Stack sx={{ flex: 1, gap: 2 }}>
        <TextField placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <FormControl>
          <TextField
            placeholder="Message"
            value={lines}
            multiline
            onChange={(event) => setLines(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
          />
          <FormHelperText sx={{ mt: 1 }}>Shift + Enter for multiple lines</FormHelperText>
        </FormControl>
      </Stack>
      <Stack sx={{ justifyContent: "center" }}>
        <WButton onClick={submit}>Send</WButton>
      </Stack>
    </Stack>
  );
};

export const DiscussionPage = () => {
  const { discussion, addMessage } = useDiscussion();
  return (
    <Stack sx={{ height: "100%" }}>
      <DiscussionList discussion={discussion ?? { messages: [] }} />
      <DiscussionForm addMessage={addMessage} />
    </Stack>
  );
};
