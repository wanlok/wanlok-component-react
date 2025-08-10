import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export interface Row {
  type: string;
  value: string;
}

export interface Snapshot {
  id?: string;
  timestamp?: Timestamp;
  rows: Row[];
}

const isValid = (snapshot: Snapshot) => {
  return !snapshot.rows.some((row) => row.value.length === 0);
};

export const useSnapshot = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    const c = collection(db, "snapshots");
    const q = query(c, orderBy("timestamp", "asc"));
    setSnapshots(
      (await getDocs(q)).docs.map((doc) => {
        const snapshot: Snapshot = doc.data() as Snapshot;
        snapshot.id = doc.id;
        return snapshot;
      })
    );
  };

  const addOrUpdateSnapshot = async (snapshot: Snapshot) => {
    const valid = isValid(snapshot);
    if (valid) {
      const { id, ...data } = snapshot;
      const c = collection(db, "snapshots");
      if (id) {
        await setDoc(doc(c, id), data, { merge: true });
      } else {
        snapshot.timestamp = serverTimestamp() as Timestamp;
        snapshot.id = (await addDoc(c, snapshot)).id;
        setSnapshots((previous) => {
          const snapshots = [...previous];
          snapshots.push(snapshot);
          return snapshots;
        });
      }
    }
    return valid;
  };

  return { snapshots, addOrUpdateSnapshot };
};
