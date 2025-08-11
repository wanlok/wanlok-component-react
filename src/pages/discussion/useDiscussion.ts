import { doc, onSnapshot, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

interface Message {
  name: string;
  lines: string;
  timestamp: number;
}

export interface Discussion {
  messages: Message[];
}

export const useDiscussion = () => {
  const [discussion, setDiscussion] = useState<Discussion>();

  useEffect(() => {
    const docRef = doc(db, "discussions", "20250810");
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setDiscussion(snapshot.data() as Discussion);
    });
    return () => unsubscribe();
  }, []);

  const addMessage = async (name: string, lines: string) => {
    const docRef = doc(db, "discussions", "20250810");
    const message: Message = { name, lines, timestamp: new Date().getTime() };
    if (discussion) {
      await updateDoc(docRef, {
        ...discussion,
        messages: [...discussion.messages, message]
      });
    } else {
      await setDoc(docRef, {
        messages: [message]
      });
    }
  };

  return { discussion, addMessage };
};
