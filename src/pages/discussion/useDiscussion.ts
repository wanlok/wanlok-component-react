import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

interface Message {
  name: string;
  message: string;
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
      const data = snapshot.data() as Discussion;
      setDiscussion(data);
    });
    return () => unsubscribe();
  }, []);

  const updateDiscussion = async (name: string, message: string) => {
    try {
      const m = {
        name,
        message,
        date: new Date()
      };
      if (discussion) {
        await updateDoc(docRef, { ...discussion, messages: [...discussion.messages, m] });
      } else {
        await setDoc(docRef, {
          messages: [m]
        });
      }
    } catch (error) {
      console.log("Failed to add discussion:", error);
    }
  };

  return { discussion, updateDiscussion };
};
