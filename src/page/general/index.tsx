import { Button, Stack, TextField } from "@mui/material";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { db } from "../../firebase";

interface Item {
  id?: string | undefined;
  name: string;
  value: string;
}

const useFetchItems = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      setItems(querySnapshot.docs.map((doc) => doc.data() as Item));
    };

    fetchData();
  }, []);

  return items;
};

const addItem = async (item: Item) => {
  try {
    await addDoc(collection(db, "items"), item);
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

export default function () {
  const items = useFetchItems();

  const [name, setName] = useState<string>();
  const [value, setValue] = useState<string>();

  const submit = () => {
    if (name && value) {
      addItem({ name, value });
    }
  };

  return (
    <Stack direction="row">
      <Stack flex={0.2} sx={{ gap: 2, p: 2 }}>
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
}
