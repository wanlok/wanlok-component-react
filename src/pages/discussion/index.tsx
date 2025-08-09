import { useState } from "react";
import { Discussion, useDiscussion } from "./useDiscussion";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";

const DiscussionList = ({ discussions }: { discussions: Discussion[] }) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      {discussions.map((discussion, i) => {
        return (
          <Stack key={"discussion-" + i} sx={{ backgroundColor: "#EEEEEE", mt: i === 0 ? 0 : "1px", p: 2, gap: 1 }}>
            <Stack sx={{ flexDirection: "row", gap: 1 }}>
              <Typography>{discussion.name}</Typography>
              <Typography>({discussion.timestamp?.toDate().toLocaleString()})</Typography>
            </Stack>
            <Stack>
              <Typography>{discussion.value}</Typography>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

const DiscussionInput = ({
  fetchDiscussions,
  addDiscussion
}: {
  fetchDiscussions: () => Promise<void>;
  addDiscussion: (discussion: Discussion) => Promise<void>;
}) => {
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const submit = async () => {
    if (name && value) {
      await addDiscussion({ name, value });
      setName("");
      setValue("");
      fetchDiscussions();
    }
  };

  return (
    <>
      <Divider />
      <Stack sx={{ flexDirection: "row", gap: 2, p: 2 }}>
        <Stack sx={{ flex: 1, gap: 2 }}>
          <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <TextField label="Value" value={value} onChange={(event) => setValue(event.target.value)} />
        </Stack>
        <Stack>
          <Button variant="contained" onClick={submit}>
            Send
          </Button>{" "}
        </Stack>
      </Stack>
    </>
  );
};

export const DiscussionPage = () => {
  const { discussions, fetchDiscussions, addDiscussion } = useDiscussion();
  return (
    <Stack sx={{ height: "100%" }}>
      <DiscussionList discussions={discussions} />
      <DiscussionInput fetchDiscussions={fetchDiscussions} addDiscussion={addDiscussion} />
    </Stack>
  );
};
