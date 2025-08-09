import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export interface Item {
  name: string;
  value: string;
}

export const useDiscussion = () => {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    setItems(querySnapshot.docs.map((doc) => doc.data() as Item));
  };

  const addItem = async (item: Item) => {
    try {
      await addDoc(collection(db, "items"), item);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, fetchItems, addItem };
};
