import {
  addDoc,
  collection,
  doc,
  getDoc,
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

  const addSnapshot = async (snapshot: Snapshot) => {
    const valid = isValid(snapshot);
    if (valid) {
      delete snapshot.id;
      snapshot.timestamp = serverTimestamp() as Timestamp;
      const c = collection(db, "snapshots");
      const docRef = await addDoc(c, snapshot);
      const savedSnapshot = (await getDoc(docRef)).data() as Snapshot;
      savedSnapshot.id = docRef.id;
      setSnapshots((previous) => {
        const snapshots = [...previous];
        snapshots.push(savedSnapshot);
        return snapshots;
      });
    }
    return valid;
  };

  const updateSnapshot = async (index: number, snapshot: Snapshot) => {
    const valid = isValid(snapshot);
    if (valid) {
      const { id, ...data } = snapshot;
      const c = collection(db, "snapshots");
      await setDoc(doc(c, id), data, { merge: true });
      setSnapshots((previous) => {
        const snapshots = [...previous];
        snapshots[index] = snapshot;
        return snapshots;
      });
    }
    return valid;
  };

  const replaceLocalSnapshot = (index: number, snapshot: Snapshot) => {
    setSnapshots((previous) => {
      const snapshots = [...previous];
      snapshots[index] = snapshot;
      return previous;
    });
  };

  return { snapshots, addSnapshot, updateSnapshot, replaceLocalSnapshot };
};
