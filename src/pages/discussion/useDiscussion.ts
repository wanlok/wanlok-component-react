import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export interface Discussion {
  name: string;
  value: string;
  timestamp?: Timestamp;
}

const c = collection(db, "discussions");

export const useDiscussion = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  const fetchDiscussions = async () => {
    const q = query(c, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    setDiscussions(querySnapshot.docs.map((doc) => doc.data() as Discussion));
  };

  const addDiscussion = async (discussion: Discussion) => {
    try {
      await addDoc(c, { ...discussion, timestamp: serverTimestamp() });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return { discussions, fetchDiscussions, addDiscussion };
};
