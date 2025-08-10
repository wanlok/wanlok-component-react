import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

interface Message {
  name: string;
  lines: string;
  date?: Date;
}

export interface Discussion {
  messages: Message[];
}

export const useDiscussion = () => {
  const [discussion, setDiscussion] = useState<Discussion>();
  const docRef = doc(db, "discussions", "20250810");

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setDiscussion(snapshot.data() as Discussion);
    });
    return () => unsubscribe();
  }, []);

  const updateDiscussion = async (name: string, message: string) => {
    const m: Message = { name, lines: message, date: new Date() };
    if (discussion) {
      await updateDoc(docRef, { ...discussion, messages: [...discussion.messages, m] });
    } else {
      await setDoc(docRef, { messages: [m] });
    }
  };

  return { discussion, updateDiscussion };
};
