import { useEffect, useRef, useState } from "react";
import { Discussion, useDiscussion } from "./useDiscussion";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";

const DiscussionList = ({ discussions }: { discussions: Discussion[] }) => {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stackRef.current) {
      stackRef.current.scrollTop = stackRef.current.scrollHeight;
    }
  }, [discussions]);

  return (
    <Stack ref={stackRef} sx={{ flex: 1, overflowY: "auto" }}>
      {discussions.map((discussion, i) => (
        <Stack key={`discussion-${i}`} sx={{ backgroundColor: "#EEEEEE", mt: i === 0 ? 0 : "1px", p: 2, gap: 1 }}>
          <Stack sx={{ flexDirection: "row", gap: 1 }}>
            <Typography>{discussion.name}</Typography>
            <Typography>({discussion.timestamp?.toDate().toLocaleString()})</Typography>
          </Stack>
          <Stack>
            {discussion.message.split("\n").map((line, j) => (
              <Typography key={`discussion-${i}-message-${j}`}>{line.length > 0 ? line : <br />}</Typography>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

const DiscussionForm = ({ addDiscussion }: { addDiscussion: (discussion: Discussion) => Promise<void> }) => {
  const getName = () => localStorage.getItem("discussion_name") ?? "";
  const [name, setName] = useState<string>(getName());
  const [message, setMessage] = useState<string>("");

  const submit = async () => {
    if (name && message) {
      localStorage.setItem("discussion_name", name);
      await addDiscussion({ name, message });
      setMessage("");
    }
  };

  return (
    <>
      <Divider />
      <Stack sx={{ flexDirection: "row", gap: 2, p: 2 }}>
        <Stack sx={{ flex: 1, gap: 2 }}>
          <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <TextField
            label="Message (Shift + Enter for multiple lines)"
            value={message}
            multiline
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
          />
        </Stack>
        <Stack sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={submit}>
            Send
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export const DiscussionPage = () => {
  const { discussions, addDiscussion } = useDiscussion();
  return (
    <Stack sx={{ height: "100%" }}>
      <DiscussionList discussions={discussions} />
      <DiscussionForm addDiscussion={addDiscussion} />
    </Stack>
  );
};
