import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export interface Discussion {
  name: string;
  message: string;
  timestamp?: Timestamp;
}

const c = collection(db, "discussions");

export const useDiscussion = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    const q = query(collection(db, "discussions"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const discussions = snapshot.docs.map((doc) => doc.data() as Discussion);
      setDiscussions(discussions);
    });
    return () => unsubscribe();
  }, []);

  const addDiscussion = async (discussion: Discussion) => {
    try {
      await addDoc(c, { ...discussion, timestamp: serverTimestamp() });
    } catch (error) {
      console.log(error);
    }
  };

  return { discussions, addDiscussion };
};
