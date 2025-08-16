import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export interface Message {
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

  const playAudio = () => {
    if (discussion && discussion.messages.length > 0) {
      const slices = discussion.messages[discussion.messages.length - 1]?.lines.split(" ");
      if (slices.length > 0) {
        import(`../../assets/audio/${slices[0]}.mp3`)
          .then((module) => {
            new Audio(module.default).play().catch(() => {});
          })
          .catch(() => {});
      }
    }
  };

  return { discussion, addMessage, playAudio };
};
