import { Button, Stack, TextField, Typography } from "@mui/material";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

interface Item {
  name: string;
  value: string;
}

const useFetchItems = () => {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    setItems(querySnapshot.docs.map((doc) => doc.data() as Item));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, fetchItems };
};

const addItem = async (item: Item) => {
  try {
    await addDoc(collection(db, "items"), item);
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

const General = () => {
  const { items, fetchItems } = useFetchItems();

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
    <Stack direction="row">
      <Stack flex={0.2} sx={{ gap: 2, p: 2 }}>
        <Typography>Input</Typography>
        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <TextField label="Value" value={value} onChange={(event) => setValue(event.target.value)} />
        <Button onClick={submit}>Submit</Button>
      </Stack>
      <Stack flex={0.8}>
        {items.map((item) => (
          <div>{JSON.stringify(item)}</div>
        ))}
      </Stack>
    </Stack>
  );
};

export default General;
