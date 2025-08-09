import { useState } from "react";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { Item, useDiscussion } from "./useDiscussion";

const DiscussionList = ({ items }: { items: Item[] }) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      {items.map((item) => (
        <Typography>{JSON.stringify(item)}</Typography>
      ))}
    </Stack>
  );
};

const DiscussionInput = ({
  fetchItems,
  addItem
}: {
  fetchItems: () => Promise<void>;
  addItem: (item: Item) => Promise<void>;
}) => {
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const submit = async () => {
    if (name && value) {
      await addItem({ name, value });
      setName("");
      setValue("");
      fetchItems();
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

export const Discussion = () => {
  const { items, fetchItems, addItem } = useDiscussion();
  return (
    <Stack sx={{ height: "100%" }}>
      <DiscussionList items={items} />
      <DiscussionInput fetchItems={fetchItems} addItem={addItem} />
    </Stack>
  );
};
