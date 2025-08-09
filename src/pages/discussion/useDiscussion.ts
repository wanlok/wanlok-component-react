import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export interface Item {
  name: string;
  value: string;
  timestamp?: Timestamp;
}

export const useDiscussion = () => {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    const q = query(collection(db, "items"), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    setItems(querySnapshot.docs.map((doc) => doc.data() as Item));
  };

  const addItem = async (item: Item) => {
    try {
      await addDoc(collection(db, "items"), { ...item, timestamp: serverTimestamp() });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, fetchItems, addItem };
};
